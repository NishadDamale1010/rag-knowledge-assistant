const openrouter = require("../config/openrouter");
const { HfInference } = require("@huggingface/inference");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

const systemPrompt = `You are a helpful AI assistant.

Answer ONLY using the provided context.

If the answer cannot be found in the context,
say:
"I couldn't find that information in the uploaded document."

Always cite sources like [1], [2].`;

const formatMessages = (context, question) => {
    return `Context:

${context}

Question:

${question}`;
};

// OpenRouter Provider
const generateAnswerOpenRouter = async (context, question) => {
    try {
        console.log("Trying OpenRouter...");
        const response = await openrouter.chat.completions.create({
            model: "openai/gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: formatMessages(context, question),
                },
            ],
            temperature: 0.2,
        });

        if (
            !response.choices ||
            !response.choices[0] ||
            !response.choices[0].message
        ) {
            throw new Error("Invalid response from OpenRouter");
        }

        console.log("✓ OpenRouter succeeded");
        return response.choices[0].message.content;
    } catch (error) {
        console.log("✗ OpenRouter failed:", error.message);
        throw error;
    }
};

// Gemini Provider
const generateAnswerGemini = async (context, question) => {
    try {
        console.log("Trying Gemini...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${systemPrompt}\n\n${formatMessages(context, question)}`,
                        },
                    ],
                },
            ],
        });

        const answer = result.response.text();
        console.log("✓ Gemini succeeded");
        return answer;
    } catch (error) {
        console.log("✗ Gemini failed:", error.message);
        throw error;
    }
};

// HuggingFace Provider
const generateAnswerHuggingFace = async (context, question) => {
    try {
        console.log("Trying HuggingFace...");
        const hf = new HfInference(process.env.HF_API_KEY);

        const response = await hf.textGeneration({
            model: "mistralai/Mistral-7B-Instruct-v0.1",
            inputs: `${systemPrompt}\n\n${formatMessages(context, question)}`,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.2,
            },
        });

        console.log("✓ HuggingFace succeeded");
        return response.generated_text;
    } catch (error) {
        console.log("✗ HuggingFace failed:", error.message);
        throw error;
    }
};

// Groq Provider
const generateAnswerGroq = async (context, question) => {
    try {
        console.log("Trying Groq...");
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const response = await groq.chat.completions.create({
            model: "llama-3.1-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: formatMessages(context, question),
                },
            ],
            temperature: 0.2,
        });

        if (
            !response.choices ||
            !response.choices[0] ||
            !response.choices[0].message
        ) {
            throw new Error("Invalid response from Groq");
        }

        console.log("✓ Groq succeeded");
        return response.choices[0].message.content;
    } catch (error) {
        console.log("✗ Groq failed:", error.message);
        throw error;
    }
};

// Fallback system - tries providers in order
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
            name: "HuggingFace",
            fn: () => generateAnswerHuggingFace(context, question),
        },
        {
            name: "Groq",
            fn: () => generateAnswerGroq(context, question),
        },
    ];

    let lastError;

    for (const provider of providers) {
        try {
            return await provider.fn();
        } catch (error) {
            lastError = error;
            continue;
        }
    }

    throw new Error(
        `LLM generation failed: All providers failed. Last error: ${lastError.message}`
    );
};

module.exports = {
    generateAnswer,
};