// Cara yang benar untuk mengimpor models.
const { db } = require('../models');
const { setBaseResponse, RSNC } = require('../utils/api/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * Membuat beberapa section sekaligus untuk satu course tertentu.
 * Diharapkan menerima array of sections di dalam request body.
 * @param {object} req - Request object.
 * @param {string} req.params.courseId - ID dari course tempat section akan dibuat.
 * @param {Array<object>} req.body.sections - Array dari objek section.
 */
exports.createMultipleSections = catchAsync(async (req, res, next) => {
  const { course_id } = req.params;
  const { sections } = req.body;

  // Validasi input: pastikan sections adalah sebuah array dan tidak kosong
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Request body harus berisi array "sections" yang tidak kosong.',
    });
  }

  // Tambahkan courseId ke setiap objek section di dalam array
  const sectionsToCreate = sections.map((section) => ({
    ...section, // salin semua properti dari objek section (title, position, dll.)
    course_id: course_id, // tambahkan courseId dari parameter URL
  }));

  // Gunakan bulkCreate untuk memasukkan semua section ke database dalam satu query
  const newSections = await db.Section.bulkCreate(sectionsToCreate, {
    validate: true, // Menjalankan validasi Sequelize pada setiap objek
  });

  return setBaseResponse(res, RSNC.OK, {
    message: `Berhasil membuat ${newSections.length} section baru.`,
    data: newSections,
  });
});

/**
 * Mengambil semua section berdasarkan courseId.
 */
exports.getSections = catchAsync(async (req, res, next) => {
  const { course_id } = req.params;

  // Perbaikan: Kueri filter harus berada di dalam objek 'where'.
  const sections = await db.Section.findAll({
    where: {
      course_id: course_id,
    },
    order: [['position', 'ASC']], // Mengurutkan section berdasarkan posisinya
  });

  return setBaseResponse(res, RSNC.OK, {
    message: `Found ${sections.length} sections`,
    data: sections,
  });
});
