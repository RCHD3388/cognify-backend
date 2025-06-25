const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllCourse = catchAsync(async (req, res, next) => {
  try {
    const course = await db.Course.findAll();
    if (course) {
      return setBaseResponse(res, RSNC.OK, {
        message: "Course retrieved successfully",
        data: course,
      });
    } else {
      return next(new AppError("Course not found", RSNC.NOT_FOUND));
    }
  } catch (error) {
    console.error(error);
    return next(new AppError("There was an error. Try again later!"), 500);
  }
});

exports.getUserCourse = catchAsync(async (req, res, next) => {
  const { firebaseId } = req.params;
  try {
    const user = await db.User.findByPk(firebaseId);

    if (!user) {
      return setBaseResponse(res, RSNC.NOT_FOUND, {
        message: "User not found",
        data: course,
      });
    }

    console.log("tes");

    const enrolledCourses = await user.getEnrolledCourses({
      attributes: [
        "course_id",
        "course_name",
        "course_description",
        "course_rating",
      ],
      joinTableAttributes: ["createdAt"],
    });

    return setBaseResponse(res, RSNC.OK, {
      message: `Successfully retrieved enrolled courses for user ${user.name}`,
      data: enrolledCourses,
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
    data: newReply,
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
