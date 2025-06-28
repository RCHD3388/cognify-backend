const { db } = require("../models");
const { snap } = require('../services/midtransService');
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.handleNotification = catchAsync(async (req, res, next) => {
  const notificationJson = req.body;

  // 1. Verifikasi notifikasi menggunakan utility dari library Midtrans
  const statusResponse = await snap.transaction.notification(notificationJson);
  const orderId = statusResponse.order_id;
  const transactionStatus = statusResponse.transaction_status;
  const fraudStatus = statusResponse.fraud_status;

  console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

  // 2. Temukan transaksi di database Anda
  const transaction = await db.Transaction.findOne({ where: { order_id: orderId } });
  if (!transaction) {
    return next(new AppError('Transaction not found.', RSNC.NOT_FOUND));
  }

  // 3. Logika utama untuk update status
  // Handle status "settlement" atau "capture" sebagai pembayaran sukses
  if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
    if (fraudStatus == 'accept') {
      // Jika pembayaran sukses dan tidak fraud, update status di DB Anda
      await transaction.update({ status: 'settlement' });

      // Tambahkan user ke course (buat entri di tabel UserCourse)
      await db.UserCourse.findOrCreate({
        where: {
          user_id: transaction.user_id,
          course_id: transaction.course_id,
        },
      });
      console.log(`SUCCESS: Enrolled user ${transaction.user_id} to course ${transaction.course_id}`);
    }
  } else if (transactionStatus == 'deny' || transactionStatus == 'expire' || transactionStatus == 'cancel') {
    // Handle pembayaran yang gagal/dibatalkan
    await transaction.update({ status: transactionStatus });
    console.log(`FAILED/EXPIRED: Payment for order ${orderId} has failed.`);
  }

  // 4. Kirim respons 200 OK ke Midtrans untuk mengonfirmasi penerimaan notifikasi
  res.status(200).send('OK');
});