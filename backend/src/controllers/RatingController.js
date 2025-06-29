const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.addOrUpdateRating = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const { rating, comment, firebaseId } = req.body;

  if (!firebaseId) {
    return next(
      new AppError(
        "firebaseId is required in the request body.",
        RSNC.BAD_REQUEST
      )
    );
  }
  if (!rating || rating < 1 || rating > 5) {
    return next(
      new AppError("A valid rating (1-5) is required.", RSNC.BAD_REQUEST)
    );
  }

  // Gunakan transaksi untuk menjaga integritas data
  const result = await db.sequelize.transaction(async (t) => {
    // --- LOGIKA UTAMA ADA DI SINI ---

    // 1. Cari rating yang sudah ada dari user ini untuk course ini.
    let existingRating = await db.Rating.findOne({
      where: {
        user_id: firebaseId,
        course_id: courseId,
      },
      transaction: t,
    });

    let savedRating;
    if (existingRating) {
      // 2a. JIKA SUDAH ADA: Update rating dan komentar yang ada.
      existingRating.rating = rating;
      existingRating.comment = comment;
      savedRating = await existingRating.save({ transaction: t });
    } else {
      // 2b. JIKA BELUM ADA: Buat entri rating yang baru.
      savedRating = await db.Rating.create(
        {
          user_id: firebaseId,
          course_id: courseId,
          rating: rating,
          comment: comment,
        },
        { transaction: t }
      );
    }
    // --- AKHIR LOGIKA UTAMA ---

    // 3. Hitung ulang rata-rata rating (logika ini tidak berubah)
    const stats = await db.Rating.findOne({
      where: { course_id: courseId },
      attributes: [
        [db.sequelize.fn("AVG", db.sequelize.col("rating")), "averageRating"],
      ],
      raw: true,
      transaction: t,
    });

    const averageRating = parseFloat(stats.averageRating || 0).toFixed(2);

    // 4. Update tabel Courses dengan rating baru
    await db.Course.update(
      { course_rating: averageRating },
      { where: { course_id: courseId }, transaction: t }
    );

    // Kembalikan rating yang baru saja disimpan/diupdate
    return { savedRating, averageRating };
  });

  return setBaseResponse(res, RSNC.OK, {
    message: "Rating submitted successfully",
    data: result,
  });
});

// Fungsi untuk mendapatkan semua rating di sebuah kursus
exports.getRatingsForCourse = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const ratings = await db.Rating.findAll({
    where: { course_id: courseId },
    include: {
      model: db.User,
      as: "Author",
      attributes: ["name", "firebaseId"],
    },
    order: [["createdAt", "DESC"]],
  });
  return setBaseResponse(res, RSNC.OK, { data: ratings });
});

exports.getUserRatingForCourse = async (req, res, next) => {
  try {
    // 1. Ambil parameter dari URL
    const { courseId, firebaseId } = req.params;

    // 2. Validasi input (opsional tapi disarankan)
    if (!courseId || !firebaseId) {
      return next(
        new AppError("Course ID and User ID are required.", RSNC.BAD_REQUEST)
      );
    }

    // 3. Cari satu rating di database berdasarkan kombinasi courseId dan user_id
    const userRating = await db.Rating.findOne({
      where: {
        course_id: courseId,
        user_id: firebaseId,
      },
      // Anda bisa menyertakan data penulis jika perlu, tapi biasanya tidak untuk "my-rating"
      // include: { model: db.User, as: 'Author', attributes: ['name'] }
    });

    // 4. Kirim respons
    //    Bahkan jika tidak ada rating (userRating adalah null), kita tetap mengirim
    //    respons sukses. Ini memberitahu frontend bahwa "tidak ada rating" adalah
    //    state yang valid, bukan sebuah error.
    return setBaseResponse(res, RSNC.OK, {
      message: userRating
        ? "User rating retrieved successfully."
        : "User has not rated this course yet.",
      data: userRating, // Akan mengirim objek rating atau null
    });
  } catch (error) {
    // 5. Tangani error tak terduga
    console.error("ERROR IN getUserRatingForCourse 💥", error);
    return next(
      new AppError(
        "Something went wrong while fetching user rating.",
        RSNC.INTERNAL_SERVER_ERROR
      )
    );
  }
};
