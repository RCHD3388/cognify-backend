const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getUserTransactions = catchAsync(async (req, res, next) => {
  // Ambil user_id dari parameter URL. 
  // Kita akan menggunakan req.params.userId dari route /users/:userId/transactions
  const { userId } = req.params;

  if (!userId) {
    return next(new AppError("User ID is required.", 400));
  }

  // Cari semua transaksi yang dimiliki oleh user_id yang diberikan
  const transactions = await db.Transaction.findAll({
    where: {
      user_id: userId, // Cocokkan dengan foreign key di model Transaction Anda
    },
    // Sertakan informasi dari model lain yang berelasi
    include: [
      {
        model: db.Course, // Relasi ke model Course
        attributes: ['course_name'], // Hanya ambil nama kursus untuk efisiensi
      },
      // Anda bisa juga menyertakan model User jika perlu, tapi biasanya tidak untuk endpoint ini
      // {
      //   model: db.User,
      //   attributes: ['name']
      // }
    ],
    // Urutkan dari yang paling baru
    order: [['createdAt', 'DESC']], 
  });

  // Jika tidak ada transaksi, kembalikan array kosong, ini bukan error
  return setBaseResponse(res, RSNC.OK, {
    message: `Found ${transactions.length} transactions for the user.`,
    data: transactions,
  });
});