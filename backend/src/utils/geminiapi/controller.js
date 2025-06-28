const { default: axios } = require("axios");
const env = require("../../config/env");

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const finalUrl = () => {
  const apiKey = env("GEMINI_API_KEY") || "";
  return `${GEMINI_API_URL}?key=${apiKey}`;
}

exports.finalUrl = finalUrl;

exports.generateOutput = async (prompt) => {
  const response = await axios.post(`${finalUrl()}`, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  const result = response.data.candidates[0].content.parts[0].text;
  return result;
}

exports.parseLearningPath = (text) => {
  const result = {};

  // Extract main description
  const mainDescMatch = text.match(/main description\s*:\s*(.+?)\s*tags\s*:/s);
  result.mainDescription = mainDescMatch ? mainDescMatch[1].trim() : "";

  // Extract tags
  const tagsMatch = text.match(/tags\s*:\s*\[(.+?)\]/s);
  if (tagsMatch) {
    result.tags = tagsMatch[1]
      .split(',')
      .map(tag => tag.trim().replace(/^["']|["']$/g, '')); // remove quotes if any
  } else {
    result.tags = [];
  }

  // Extract all paths
  const pathRegex = /path (\d+) :\s*title\s*:\s*(.+?)\s*description\s*:\s*(.+?)\s*time\s*:\s*(.+?)(?=path \d+ :|end_of_path)/gs;

  const paths = [];
  let match;
  while ((match = pathRegex.exec(text)) !== null) {
    paths.push({
      smartId: 1,
      stepNumber: Number(match[1]),
      title: match[2].trim(),
      description: match[3].trim(),
      estimatedTime: match[4].trim(),
    });
  }

  result.paths = paths;
  return result;
};


exports.generateCompletePrompt = (template, placeholders) => {
  let completePrompt = template;
  for (const [key, value] of Object.entries(placeholders)) {
    const placeholderRegex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    completePrompt = completePrompt.replace(placeholderRegex, value);
  }
  return completePrompt;
}

// // Contoh penggunaan
// const template = "Halo, {{name}}! Bagaimana kabar?";
// const placeholders = { name: "John Doe" };
// const completePrompt = generateCompletePrompt(template, placeholders);
// console.log(completePrompt); // Output: Halo, John Doe! Bagaimana kabar?

