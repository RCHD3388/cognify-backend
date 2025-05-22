const { default: axios } = require("axios");
const env = require("../../config/env");

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

exports.finalUrl = () => {
  const apiKey = env("GEMINI_API_KEY") || "";
  return `${GEMINI_API_URL}?key=${apiKey}`;
}


