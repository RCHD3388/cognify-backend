const { db } = require("../models"); // Pastikan path ini benar
const { setBaseResponse, RSNC } = require("../utils/api/apiResponse");
const catchAsync = require("../utils/catchAsync");

/**
 * Membuat beberapa material sekaligus untuk satu section tertentu.
 * Diharapkan menerima array of materials di dalam request body.
 * @param {object} req - Request object.
 * @param {string} req.params.sectionId - ID dari section tempat material akan dibuat.
 * @param {Array<object>} req.body.materials - Array dari objek material.
 */
exports.createMultipleMaterials = catchAsync(async (req, res, next) => {
  const { sectionId } = req.params;

  // ------------------------- BLOK PERBAIKAN MULAI -------------------------

  const materialsRaw = req.body.materials;
  let materialsArray;

  // 1. Validasi awal: pastikan materialsRaw ada dan berupa string
  if (!materialsRaw || typeof materialsRaw !== "string") {
    return res.status(400).json({
      status: "error",
      message:
        'Field "materials" wajib diisi dan harus berupa stringified JSON.',
    });
  }

  // 2. Parsing JSON yang lebih robust
  try {
    const parsedData = JSON.parse(materialsRaw);

    // Cek jika hasil parse adalah objek yang berisi array {materials: [...]}
    if (parsedData && Array.isArray(parsedData.materials)) {
      materialsArray = parsedData.materials;
    }
    // Cek jika hasil parse adalah array langsung [...]
    else if (Array.isArray(parsedData)) {
      materialsArray = parsedData;
    }
    // Jika format tidak sesuai
    else {
      throw new Error(
        'Format JSON tidak valid. Harus berupa array atau objek dengan key "materials".'
      );
    }
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message || 'Gagal mem-parsing string JSON "materials".',
    });
  }

  // 3. Validasi isi array
  if (!materialsArray || materialsArray.length === 0) {
    return res.status(400).json({
      status: "error",
      message: 'Array "materials" tidak boleh kosong.',
    });
  }

  // ------------------------- BLOK PERBAIKAN SELESAI -------------------------

  // Logika Anda selanjutnya sudah benar, kita hanya perlu mengganti `materials` dengan `materialsArray`
  let fileIndex = 0;
  const files = req.files || [];

  const materialsToCreate = materialsArray.map((material) => {
    const newMaterial = {
      ...material,
      section_id: sectionId,
    };

    // Logika ini sudah benar, tidak perlu diubah.
    if (
      ["video", "document", "image"].includes(material.material_type) &&
      files[fileIndex]
    ) {
      // Pastikan Anda menyimpan path ke kolom yang benar, misal `url`
      newMaterial.url = files[fileIndex].location;
      fileIndex++;
    }

    return newMaterial;
  });

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
