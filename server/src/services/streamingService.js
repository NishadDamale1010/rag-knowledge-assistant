const Groq = require("groq-sdk");
const openrouter = require("../config/openrouter");
const { systemPrompt, formatMessages } = require("./llmService");

const buildMessages = (context, question) => [
    { role: "system", content: systemPrompt },
    { role: "user", content: formatMessages(context, question) },
];

const createOpenRouterStream = async (context, question) => {
    console.log("Streaming via OpenRouter...");
    return openrouter.chat.completions.create({
        model: process.env.OPENROUTER_STREAM_MODEL || "openai/gpt-3.5-turbo",
        stream: true,
        temperature: 0.2,
        messages: buildMessages(context, question),
    });
};

const createGroqStream = async (context, question) => {
    console.log("Streaming via Groq...");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    return groq.chat.completions.create({
        model: process.env.GROQ_STREAM_MODEL || "llama-3.1-70b-versatile",
        stream: true,
        temperature: 0.2,
        messages: buildMessages(context, question),
    });
};

const createStream = async (context, question) => {
    const providers = [
        { name: "OpenRouter", fn: () => createOpenRouterStream(context, question) },
        { name: "Groq", fn: () => createGroqStream(context, question) },
    ];

    let lastError;

    for (const provider of providers) {
        try {
            return await provider.fn();
        } catch (error) {
            console.log(`✗ ${provider.name} stream failed:`, error.message);
            lastError = error;
        }
    }

    throw new Error(
        `Streaming failed: ${lastError?.message || "No providers available"}`
    );
};

module.exports = { createStream };
