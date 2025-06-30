const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { snap } = require("../services/midtransService");

exports.createCourse = catchAsync(async (req, res, next) => {
  const {
    course_name,
    course_description,
    course_owner,
    course_price,
    category_id,
    course_owner_name,
  } = req.body;

  let thumbnailUrl = null;
  if (req.file) {
    // Ambil URL lengkap dari S3 yang disediakan oleh multer-s3
    thumbnailUrl = req.file.location;
  }

  if (
    !course_name ||
    !course_description ||
    !course_owner ||
    !course_price ||
    !category_id ||
    !course_owner_name
  ) {
    return next(
      new AppError("Missing required course fields", RSNC.BAD_REQUEST)
    );
  }

  try {
    const newCourse = await db.Course.create({
      course_id: uuidv4(), // <-- 2. Buat dan masukkan ID unik di sini
      course_name,
      course_description,
      course_owner,
      course_rating: 0.0,
      course_price,
      category_id,
      course_owner_name,
      thumbnail: thumbnailUrl,
    });

    // Respons sukses Anda
    return setBaseResponse(res, RSNC.CREATED, {
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("ERROR CREATING COURSE �", error);
    // Jika error karena validasi DB atau constraint
    if (
      error.name === "SequelizeUniqueConstraintError" ||
      error.name === "SequelizeValidationError"
    ) {
      const messages = error.errors.map((err) => err.message).join(", ");
      return next(new AppError(messages, RSNC.BAD_REQUEST));
    }
    // Error lainnya
    return next(
      new AppError(
        "Failed to create course. Please try again later.",
        RSNC.INTERNAL_SERVER_ERROR
      )
    );
  }
});
exports.getAllCourse = catchAsync(async (req, res, next) => {
  try {
    // 1. Ambil query parameter 'q' dari request
    const { q } = req.query;

    // 2. Siapkan objek opsi untuk query Sequelize
    const queryOptions = {
      include: [
        {
          model: db.User,
          as: "Owner",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    };

    // 3. Jika 'q' ada dan tidak kosong, tambahkan 'where' clause
    if (q && q.trim() !== "") {
      queryOptions.where = {
        course_name: {
          [Op.like]: `%${q}%`, // iLike untuk case-insensitive (PostgreSQL)
          // Gunakan Op.like untuk MySQL
        },
      };
    }

    // 4. Jalankan query dengan opsi yang sudah disiapkan
    const courses = await db.Course.findAll(queryOptions);

    // `findAll` akan mengembalikan array kosong jika tidak ada hasil,
    // jadi pengecekan `if (courses)` tidak lagi se-krusial itu,
    // tetapi tidak masalah jika tetap ada.

    // Format hasil untuk menyatukan nama owner
    const formattedCourses = courses.map((course) => {
      const courseJson = course.toJSON();
      courseJson.course_owner_name = courseJson.Owner
        ? courseJson.Owner.name
        : "Unknown";
      delete courseJson.Owner;
      return courseJson;
    });

    return setBaseResponse(res, RSNC.OK, {
      message: "Courses retrieved successfully",
      data: formattedCourses,
    });
  } catch (error) {
    console.error("ERROR in getAllCourse 💥", error);
    return next(new AppError("There was an error. Try again later!"), 500);
  }
});

exports.getUserEnrolledCourse = catchAsync(async (req, res, next) => {
  const { firebaseId } = req.params;
  // Ambil query pencarian dari query parameter, contoh: ?q=design
  const { q } = req.query;

  try {
    const user = await db.User.findByPk(firebaseId);

    if (!user) {
      return setBaseResponse(res, RSNC.NOT_FOUND, {
        message: "User not found",
      });
    }

    // --- LOGIKA PENCARIAN DITAMBAHKAN DI SINI ---
    const courseQueryOptions = {
      attributes: [
        "course_id",
        "course_name",
        "course_description",
        "course_owner",
        "course_price",
        "category_id",
        "course_rating",
        "thumbnail",
        "course_owner_name",
      ],
      joinTableAttributes: ["createdAt"],
    };

    // Jika ada query pencarian (q), tambahkan klausa 'where'
    if (q && q.trim() !== "") {
      courseQueryOptions.where = {
        course_name: {
          [Op.like]: `%${q}%`, // Cari kursus yang namanya mengandung string 'q'
        },
      };
    }
    // --- AKHIR LOGIKA PENCARIAN ---

    const enrolledCourses = await user.getEnrolledCourses(courseQueryOptions);

    return setBaseResponse(res, RSNC.OK, {
      message: `Successfully retrieved enrolled courses for user ${user.name}`,
      data: enrolledCourses,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("There was an error. Try again later!"), 500);
  }
});

exports.getUserCreatedCourse = catchAsync(async (req, res, next) => {
  const { firebaseId } = req.params;
  try {
    const user = await db.User.findByPk(firebaseId);

    if (!user) {
      return setBaseResponse(res, RSNC.NOT_FOUND, {
        message: "User not found",
        data: course,
      });
    }

    const ownedCourses = await db.Course.findAll({
      where: {
        course_owner: firebaseId,
      },
      attributes: [
        "course_id",
        "course_name",
        "course_description",
        "course_rating",
        "thumbnail",
        "course_owner",
        "course_price",
        "category_id",
        "course_owner_name",
      ],
    });

    return setBaseResponse(res, RSNC.OK, {
      message: `Successfully retrieved owned courses for user ${user.name}`,
      data: ownedCourses,
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("There was an error. Try again later!"), 500);
  }
});

// Di dalam sebuah fungsi controller
exports.createDiscussionPost = async (req, res) => {
  const { content, courseId } = req.body;
  const userId = req.params.firebaseId;

  const newPost = await db.CourseDiscussion.create({
    content: content,
    course_id: courseId,
    user_id: userId,
    parent_id: null, // parent_id adalah null karena ini post utama
  });

  return setBaseResponse(res, RSNC.CREATED, {
    message: `Successfully created discussion post for course ${courseId}`,
    data: newPost,
  });
};

exports.createReply = async (req, res) => {
  const { content, courseId } = req.body;
  const { parentId } = req.params; // Ambil ID post induk dari URL, misal: /discussions/:parentId/reply
  const userId = req.params.firebaseId;

  const parentPost = await db.CourseDiscussion.findByPk(parentId);

  if (!parentPost) {
    return next(
      new AppError(
        "The discussion you are trying to reply to does not exist.",
        RSNC.NOT_FOUND
      )
    );
  }

  const newReply = await db.CourseDiscussion.create({
    content: content,
    course_id: parentPost.course_id, // Tetap perlu courseId
    user_id: userId,
    parent_id: parentId, // Set parent_id dengan ID post yang dibalas
  });

  return setBaseResponse(res, RSNC.CREATED, {
    message: `Successfully created reply for discussion post ${parentId}`,
    data: {
      id: newReply.id,
      content: newReply.content,
      course_id: newReply.course_id,
      user_id: newReply.user_id,
      parent_id: newReply.parent_id,
      createdAt: newReply.createdAt,
      updatedAt: newReply.updatedAt,
    },
  });
};

exports.getDiscussionsForCourse = async (req, res, next) => {
  try {
    // --- Logika utama Anda berada di dalam blok try ---

    const { courseId } = req.params;
    console.log(courseId);

    // Cek apakah courseId ada
    if (!courseId) {
      // Menggunakan 'next' untuk meneruskan error ke middleware error handler

      return next(new AppError("Course ID is required.", RSNC.BAD_REQUEST));
    }

    const discussions = await db.CourseDiscussion.findAll({
      where: {
        course_id: courseId,
        parent_id: null, // Hanya ambil post utama (yang tidak punya induk)
      },
      include: [
        {
          model: db.User, // Sertakan informasi penulis
          as: "Author",
          attributes: ["name", "firebaseId"], // Pilih atribut yang mau ditampilkan
        },
        {
          model: db.CourseDiscussion, // Sertakan semua balasan
          as: "Replies",
          include: {
            // Di dalam balasan, sertakan juga penulisnya
            model: db.User,
            as: "Author",
            attributes: ["name", "firebaseId"],
          },
          order: [["createdAt", "ASC"]], // Urutkan balasan dari yang terlama
        },
      ],
      order: [["createdAt", "DESC"]], // Urutkan post utama dari yang terbaru
    });

    // Jika tidak ada diskusi, Anda bisa memilih untuk mengembalikan array kosong
    // atau pesan 'not found'. Array kosong lebih umum.
    if (!discussions) {
      // Ini jarang terjadi, findAll mengembalikan [] jika tidak ada data, bukan null

      return next(
        new AppError("Discussions not found for this course.", RSNC.NOT_FOUND)
      );
    }

    // Kirim respons sukses
    return setBaseResponse(res, RSNC.OK, {
      message: `Successfully retrieved discussions for course ${courseId}`,
      data: discussions,
    });
  } catch (error) {
    // --- Blok catch untuk menangani semua error yang terjadi di blok try ---

    // Log error ke konsol untuk debugging
    console.error("ERROR IN getDiscussionsForCourse 💥", error);

    // Teruskan error ke middleware error handler global Anda
    // Ini akan memastikan respons error yang konsisten di seluruh API
    return next(
      new AppError("Something went very wrong!", RSNC.INTERNAL_SERVER_ERROR)
    );
  }
};

exports.getCourseById = catchAsync(async (req, res, next) => {
  const { courseId } = req.params; // Ambil courseId dari parameter URL

  try {
    const course = await db.Course.findByPk(courseId, {
      // Anda bisa menyertakan relasi lain di sini jika perlu,
      // misalnya data instructor dari tabel User
      // include: [{ model: db.User, as: 'Instructor' }]
    });

    if (!course) {
      return next(
        new AppError("Course with that ID not found", RSNC.NOT_FOUND)
      );
    }

    return setBaseResponse(res, RSNC.OK, {
      message: "Course details retrieved successfully",
      data: course, // Kirim data course yang ditemukan
    });
  } catch (error) {
    console.error("ERROR FETCHING COURSE BY ID 💥", error);
    return next(
      new AppError("There was an error fetching the course. Please try again."),
      RSNC.INTERNAL_SERVER_ERROR
    );
  }
});

exports.createPayment = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.body.firebaseId; // Asumsi Anda punya data user dari middleware auth

  // 1. Dapatkan detail course dan user dari database
  const course = await db.Course.findByPk(courseId);
  const user = await db.User.findByPk(userId);

  if (!course) {
    return next(new AppError("Course not found", RSNC.NOT_FOUND));
  }
  if (!user) {
    return next(new AppError("User not found", RSNC.NOT_FOUND));
  }

  const shortUUID = uuidv4().substring(0, 18); // Ambil 18 karakter pertama dari UUID
  const orderId = `CGN-${Date.now()}-${shortUUID}`; // Hasilnya sekitar 1 + 4 + 13 + 1 + 18 = 37 karakter

  // ... sisa kode Anda sama persis
  // 3. Buat parameter untuk Midtrans
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: course.course_price,
    },
    item_details: [
      {
        id: course.course_id,
        price: course.course_price,
        quantity: 1,
        name: course.course_name,
      },
    ],
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
  };

  // 4. Panggil Midtrans Snap API
  const transaction = await snap.createTransaction(parameter);

  // 5. Simpan catatan transaksi ke database Anda
  await db.Transaction.create({
    order_id: orderId,
    course_id: courseId,
    user_id: userId,
    gross_amount: course.course_price,
    status: "pending",
    payment_token: transaction.token,
  });

  // 6. Kirim token kembali ke client (aplikasi Android)
  return setBaseResponse(res, RSNC.CREATED, {
    message: "Payment token created successfully",
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  });
});

exports.getCourses = catchAsync(async (req, res, next) => {
  // Ambil parameter sortBy dari query, contoh: /api/v1/courses?sortBy=recent
  const { sortBy } = req.query;

  const queryOptions = {
    attributes: [
      "course_id",
      "course_name",
      "course_description",
      "course_owner",
      "course_price",
      "category_id",
      "course_rating",
      "thumbnail",
    ],
    include: [
      {
        // Sertakan nama pemilik kursus
        model: db.User,
        as: "Owner",
        attributes: ["name"],
      },
    ],
    limit: 10, // Batasi hasil agar tidak terlalu banyak
  };

  // Tentukan urutan berdasarkan parameter sortBy
  switch (sortBy) {
    case "recent":
      // Urutkan berdasarkan tanggal dibuat, dari yang paling baru
      queryOptions.order = [["createdAt", "DESC"]];
      break;
    case "highest_rating":
      // Urutkan berdasarkan kolom course_rating, dari yang tertinggi
      queryOptions.order = [["course_rating", "DESC"]];
      break;
    case "bestseller":
      // Untuk 'bestseller', kita perlu menghitung jumlah pendaftar.
      // Ini memerlukan query yang lebih kompleks.
      queryOptions.attributes.push([
        db.sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM "UserCourses"
                    WHERE "UserCourses"."course_id" = "Course"."course_id"
                )`),
        "enrollmentCount",
      ]);
      queryOptions.order = [
        [db.sequelize.literal('"enrollmentCount"'), "DESC"],
      ];
      break;
    default:
      // Default sorting jika sortBy tidak ada atau tidak valid
      queryOptions.order = [["createdAt", "DESC"]];
      break;
  }

  const courses = await db.Course.findAll(queryOptions);

  // Proses hasil untuk menyatukan nama owner ke dalam objek utama
  const formattedCourses = courses.map((course) => {
    const courseJson = course.toJSON();
    courseJson.course_owner_name = courseJson.Owner
      ? courseJson.Owner.name
      : "Unknown";
    delete courseJson.Owner; // Hapus objek Owner yang ter-nesting
    return courseJson;
  });

  return setBaseResponse(res, RSNC.OK, {
    message: `Successfully retrieved courses sorted by ${sortBy || "recent"}`,
    data: formattedCourses,
  });
});
