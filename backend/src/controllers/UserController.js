const { db } = require("../models");
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Op } = require("sequelize");

exports.searchUsers = catchAsync(async (req, res, next) => {
  // Ambil query pencarian dari query parameter, misal: /api/v1/users/search?q=john
  const { q } = req.query;

  if (!q || q.trim() === "") {
    // Jika query kosong, kembalikan array kosong daripada semua user
    const users = await db.User.findAll({
      attributes: ["firebaseId", "name", "email", "role"],
    });
    return setBaseResponse(res, RSNC.OK, {
      message: `Found ${users.length}`,
      data: users,
    });
  }

  // Cari pengguna yang namanya mengandung string query (case-insensitive)
  const users = await db.User.findAll({
    where: {
      name: {
        [Op.like]: `%${q}%`, // iLike untuk case-insensitive (PostgreSQL).
        // Gunakan Op.like untuk MySQL/lainnya.
      },
    },
    attributes: ["firebaseId", "name", "email", "role"], // Pilih data yang mau dikembalikan
    limit: 20, // Batasi hasil agar tidak terlalu banyak
  });

  return setBaseResponse(res, RSNC.OK, {
    message: `Found ${users.length} users matching "${q}"`,
    data: users,
  });
});
