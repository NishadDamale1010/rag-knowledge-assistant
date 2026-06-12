const Groq = require("groq-sdk");
const openrouter = require("../config/openrouter");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { systemPrompt, formatMessages, buildMessages } = require("./llmService");
const {
    getOpenRouterModelFallbacks,
    getGroqModelFallbacks,
    getGeminiModelFallbacks,
} = require("./modelFallbacks");

const REQUEST_TIMEOUT_MS = Number(process.env.LLM_REQUEST_TIMEOUT_MS || 30000);

const withTimeout = async (promise, label) => {
    let timeout;
    const timeoutPromise = new Promise((_, reject) => {
        timeout = setTimeout(
            () => reject(new Error(`${label} timed out after ${REQUEST_TIMEOUT_MS}ms`)),
            REQUEST_TIMEOUT_MS
        );
    });

    try {
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        clearTimeout(timeout);
    }
};

const getStatusCode = (error) =>
    error?.status ||
    error?.statusCode ||
    error?.response?.status ||
    error?.cause?.status;

const isAuthError = (error) => [401, 403].includes(Number(getStatusCode(error)));

const createOpenRouterStream = async (context, question) => {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_KEY not configured");
    }

    const models = await getOpenRouterModelFallbacks();
    let lastError;

    for (const model of models) {
        try {
            console.log(`Streaming via OpenRouter model: ${model}`);
            const stream = await openrouter.chat.completions.create(
                {
                    model,
                    stream: true,
                    temperature: 0.2,
                    messages: buildMessages(context, question),
                },
                { timeout: REQUEST_TIMEOUT_MS }
            );
            return { stream, type: "openai", model };
        } catch (error) {
            console.log(`OpenRouter stream model ${model} failed: ${error.message}`);
            lastError = error;
            if (isAuthError(error)) break;
        }
    }

    throw lastError || new Error("All OpenRouter stream models failed");
};

const createGroqStream = async (context, question) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY not configured");
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const models = await getGroqModelFallbacks(groq);
    let lastError;

    for (const model of models) {
        try {
            console.log(`Streaming via Groq model: ${model}`);
            const stream = await groq.chat.completions.create(
                {
                    model,
                    stream: true,
                    temperature: 0.2,
                    messages: buildMessages(context, question),
                },
                { timeout: REQUEST_TIMEOUT_MS }
            );
            return { stream, type: "openai", model };
        } catch (error) {
            console.log(`Groq stream model ${model} failed: ${error.message}`);
            lastError = error;
            if (isAuthError(error)) break;
        }
    }

    throw lastError || new Error("All Groq stream models failed");
};

const createGeminiStream = async (context, question) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = getGeminiModelFallbacks();
    let lastError;

    for (const modelName of models) {
        try {
            console.log(`Streaming via Gemini model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await withTimeout(
                model.generateContentStream({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `${systemPrompt}\n\n${formatMessages(
                                        context,
                                        question
                                    )}`,
                                },
                            ],
                        },
                    ],
                }),
                `Gemini stream model ${modelName}`
            );

            return { stream: result.stream, type: "gemini", model: modelName };
        } catch (error) {
            console.log(`Gemini stream model ${modelName} failed: ${error.message}`);
            lastError = error;
            if (isAuthError(error)) break;
        }
    }

    throw lastError || new Error("All Gemini stream models failed");
};

async function* normaliseStream(providerResult) {
    const { stream, type } = providerResult;

    if (type === "gemini") {
        for await (const chunk of stream) {
            const text = chunk.text();
            if (text) yield { token: text };
        }
        return;
    }

    for await (const part of stream) {
        const token = part.choices?.[0]?.delta?.content || "";
        if (token) yield { token };
    }
}

const createStream = async (context, question) => {
    const providers = [
        { name: "OpenRouter", fn: () => createOpenRouterStream(context, question) },
        { name: "Groq", fn: () => createGroqStream(context, question) },
        { name: "Gemini", fn: () => createGeminiStream(context, question) },
    ];

    let lastError;

    for (const provider of providers) {
        try {
            const providerResult = await provider.fn();
            const iterator = normaliseStream(providerResult);
            const first = await withTimeout(
                iterator.next(),
                `${provider.name} stream first token`
            );

            if (first.done) {
                throw new Error(`${provider.name} returned an empty stream`);
            }

            async function* prependFirst() {
                yield first.value;
                yield* iterator;
            }

            console.log(
                `${provider.name} stream validated on model ${providerResult.model}`
            );
            return prependFirst();
        } catch (error) {
            console.log(`${provider.name} stream failed: ${error.message}`);
            lastError = error;
        }
    }

    console.log("All streaming providers failed:", lastError?.message);
    return null;
};

module.exports = { createStream };
