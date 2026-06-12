const openrouter = require("../config/openrouter");
const { HfInference } = require("@huggingface/inference");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const {
    getOpenRouterModelFallbacks,
    getGroqModelFallbacks,
    getGeminiModelFallbacks,
    getHuggingFaceModelFallbacks,
} = require("./modelFallbacks");
const { redactCodeFromText } = require("../utils/responseSanitizer");

const REQUEST_TIMEOUT_MS = Number(process.env.LLM_REQUEST_TIMEOUT_MS || 30000);

const systemPrompt = `You are a helpful AI assistant.

Answer ONLY using the provided context.

If the answer cannot be found in the context,
say:
"I couldn't find that information in the uploaded document."

Do not reveal raw source code, stack traces, secrets, or long verbatim code-like snippets from the context. When context contains code, explain what it does in plain language instead.

Always cite sources like [1], [2].`;

const formatMessages = (context, question) => {
    return `Context:

${context}

Question:

${question}`;
};

const buildMessages = (context, question) => [
    { role: "system", content: systemPrompt },
    { role: "user", content: formatMessages(context, question) },
];

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

const ensureAnswer = (answer, providerName, model) => {
    const safeAnswer = redactCodeFromText(answer || "").text;
    if (!safeAnswer) {
        throw new Error(`${providerName} model ${model} returned an empty answer`);
    }
    return safeAnswer;
};

const generateAnswerOpenRouter = async (context, question) => {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_KEY not configured");
    }

    const models = await getOpenRouterModelFallbacks();
    let lastError;

    for (const model of models) {
        try {
            console.log(`Trying OpenRouter model: ${model}`);
            const response = await openrouter.chat.completions.create(
                {
                    model,
                    messages: buildMessages(context, question),
                    temperature: 0.2,
                },
                { timeout: REQUEST_TIMEOUT_MS }
            );

            const answer = response.choices?.[0]?.message?.content;
            console.log(`OpenRouter model ${model} succeeded`);
            return ensureAnswer(answer, "OpenRouter", model);
        } catch (error) {
            console.log(`OpenRouter model ${model} failed: ${error.message}`);
            lastError = error;
            if (isAuthError(error)) break;
        }
    }

    throw lastError || new Error("All OpenRouter models failed");
};

const generateAnswerGemini = async (context, question) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = getGeminiModelFallbacks();
    let lastError;

    for (const modelName of models) {
        try {
            console.log(`Trying Gemini model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await withTimeout(
                model.generateContent({
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
                `Gemini model ${modelName}`
            );

            const answer = result.response.text();
            console.log(`Gemini model ${modelName} succeeded`);
            return ensureAnswer(answer, "Gemini", modelName);
        } catch (error) {
            console.log(`Gemini model ${modelName} failed: ${error.message}`);
            lastError = error;
            if (isAuthError(error)) break;
        }
    }

    throw lastError || new Error("All Gemini models failed");
};

const generateAnswerHuggingFace = async (context, question) => {
    if (!process.env.HF_API_KEY) {
        throw new Error("HF_API_KEY not configured");
    }

    const hf = new HfInference(process.env.HF_API_KEY);
    const models = getHuggingFaceModelFallbacks();
    let lastError;

    for (const model of models) {
        try {
            console.log(`Trying HuggingFace model: ${model}`);
            const prompt = `${systemPrompt}\n\n${formatMessages(context, question)}`;
            const response = await withTimeout(
                hf.textGeneration({
                    model,
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 500,
                        temperature: 0.2,
                    },
                }),
                `HuggingFace model ${model}`
            );

            console.log(`HuggingFace model ${model} succeeded`);
            const answer = response.generated_text?.startsWith(prompt)
                ? response.generated_text.slice(prompt.length).trim()
                : response.generated_text;
            return ensureAnswer(answer, "HuggingFace", model);
        } catch (error) {
            console.log(`HuggingFace model ${model} failed: ${error.message}`);
            lastError = error;
            if (isAuthError(error)) break;
        }
    }

    throw lastError || new Error("All HuggingFace models failed");
};

const generateAnswerGroq = async (context, question) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY not configured");
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const models = await getGroqModelFallbacks(groq);
    let lastError;

    for (const model of models) {
        try {
            console.log(`Trying Groq model: ${model}`);
            const response = await groq.chat.completions.create(
                {
                    model,
                    messages: buildMessages(context, question),
                    temperature: 0.2,
                },
                { timeout: REQUEST_TIMEOUT_MS }
            );

            const answer = response.choices?.[0]?.message?.content;
            console.log(`Groq model ${model} succeeded`);
            return ensureAnswer(answer, "Groq", model);
        } catch (error) {
            console.log(`Groq model ${model} failed: ${error.message}`);
            lastError = error;
            if (isAuthError(error)) break;
        }
    }

    throw lastError || new Error("All Groq models failed");
};

const generateAnswer = async (context, question) => {
    const providers = [
        {
            name: "OpenRouter",
            fn: () => generateAnswerOpenRouter(context, question),
        },
        {
            name: "Gemini",
            fn: () => generateAnswerGemini(context, question),
        },
        {
            name: "Groq",
            fn: () => generateAnswerGroq(context, question),
        },
        {
            name: "HuggingFace",
            fn: () => generateAnswerHuggingFace(context, question),
        },
    ];

    let lastError;

    for (const provider of providers) {
        try {
            return await provider.fn();
        } catch (error) {
            console.log(`${provider.name} provider failed: ${error.message}`);
            lastError = error;
        }
    }

    throw new Error(
        `LLM generation failed: All providers failed. Last error: ${
            lastError?.message || "No providers available"
        }`
    );
};

module.exports = {
    generateAnswer,
    systemPrompt,
    formatMessages,
    buildMessages,
};
