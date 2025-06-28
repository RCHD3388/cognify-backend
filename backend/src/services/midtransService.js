const midtransClient = require("midtrans-client");
const getEnv = require("../config/env");

// 2. Gunakan helper getEnv untuk mengambil nilai dari process.env
const isProduction = getEnv("MIDTRANS_IS_PRODUCTION") === "true";
const serverKey = getEnv("MIDTRANS_SERVER_KEY");
const clientKey = getEnv("MIDTRANS_CLIENT_KEY");

// Pastikan semua variabel ada sebelum melanjutkan
if (!serverKey || !clientKey) {
    throw new Error(
        "Midtrans server key or client key is not set in .env file"
    );
}

// Inisialisasi Snap API client menggunakan variabel yang sudah diambil
const snap = new midtransClient.Snap({
    isProduction: isProduction,
    serverKey: serverKey,
    clientKey: clientKey,
});

module.exports = { snap };
