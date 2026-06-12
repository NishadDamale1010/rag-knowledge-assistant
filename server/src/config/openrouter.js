const openAI = require('openai');
const openrouter = new openAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
});
module.exports = openrouter;
