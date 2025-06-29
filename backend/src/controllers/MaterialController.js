const { db } = require('../models'); // Pastikan path ini benar
const { setBaseResponse, RSNC } = require('../utils/api/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * Membuat beberapa material sekaligus untuk satu section tertentu.
 * Diharapkan menerima array of materials di dalam request body.
 * @param {object} req - Request object.
 * @param {string} req.params.sectionId - ID dari section tempat material akan dibuat.
 * @param {Array<object>} req.body.materials - Array dari objek material.
 */
exports.createMultipleMaterials = catchAsync(async (req, res, next) => {
  const { sectionId } = req.params;

  let materialsRaw = req.body.materials;
  let materials;
  try {
    materials = JSON.parse(materialsRaw).materials;
  } catch (error) {
    materials = materialsRaw;
  }

  // Validasi input: pastikan materials adalah sebuah array dan tidak kosong
  if (!materials || !Array.isArray(materials) || materials.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Request body harus berisi array "materials" yang tidak kosong.',
    });
  }
  let fileIndex = 0;
  const files = req.files || [];

  // Tambahkan section_id ke setiap objek material di dalam array
  const materialsToCreate = materials.map((material) => {
    const newMaterial = {
      ...material,
      section_id: sectionId,
    };

    if (
      ['video', 'document', 'image'].includes(material.material_type) &&
      files[fileIndex]
    ) {
      newMaterial.url = files[fileIndex].path;
      fileIndex++;
    }

    return newMaterial;
  });

  // 4. Gunakan bulkCreate seperti sebelumnya
  const newMaterials = await db.Material.bulkCreate(materialsToCreate, {
    validate: true,
  });

  return setBaseResponse(res, RSNC.OK, {
    message: `Berhasil membuat ${newMaterials.length} material baru.`,
    data: newMaterials,
  });
});

/**
 * Mengambil semua material berdasarkan section_id.
 * Kode Anda sudah benar, tidak ada perubahan.
 */
exports.getMaterials = catchAsync(async (req, res, next) => {
  const materials = await db.Material.findAll({
    where: {
      section_id: req.params.sectionId,
    },
  });
  return setBaseResponse(res, RSNC.OK, {
    message: `Found ${materials.length} materials`,
    data: materials,
  });
});