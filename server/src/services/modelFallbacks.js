const OPENROUTER_MODELS_URL =
    "https://openrouter.ai/api/v1/models?output_modalities=text&sort=pricing-low-to-high";
const CACHE_TTL_MS = 15 * 60 * 1000;
const DISCOVERY_TIMEOUT_MS = 5000;

const OPENROUTER_FREE_ROUTER_MODEL = "openrouter/free";

const STATIC_OPENROUTER_FREE_MODELS = [
    OPENROUTER_FREE_ROUTER_MODEL,
    "openrouter/owl-alpha",
    "openai/gpt-oss-120b:free",
    "openai/gpt-oss-20b:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
    "qwen/qwen3-coder:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-3-ultra-550b-a55b:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "nex-agi/nex-n2-pro:free",
    "liquid/lfm-2.5-1.2b-thinking:free",
    "liquid/lfm-2.5-1.2b-instruct:free",
    "poolside/laguna-m.1:free",
    "poolside/laguna-xs.2:free",
    "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    "nvidia/nemotron-3.5-content-safety:free",
];

const STATIC_GROQ_CHAT_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "gemma2-9b-it",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3-32b",
    "deepseek-r1-distill-llama-70b",
];

const STATIC_GEMINI_MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
];

const STATIC_HUGGINGFACE_MODELS = [
    "mistralai/Mistral-7B-Instruct-v0.1",
    "HuggingFaceH4/zephyr-7b-beta",
    "google/flan-t5-large",
];

let openRouterCache = {
    expiresAt: 0,
    models: [],
};

let groqCache = {
    expiresAt: 0,
    models: [],
};

const splitModelList = (value) =>
    (value || "")
        .split(/[\n,]/)
        .map((model) => model.trim())
        .filter(Boolean);

const unique = (models) => [...new Set(models.filter(Boolean))];

const priceIsZero = (value) => Number(value || 0) === 0;

const isTextModel = (model) => {
    const output = model?.architecture?.output_modalities || [];
    return output.length === 0 || output.includes("text");
};

const isFreeOpenRouterModel = (model) => {
    if (!model?.id || !isTextModel(model)) return false;
    if (model.id === OPENROUTER_FREE_ROUTER_MODEL) return true;
    if (model.id.endsWith(":free")) return true;

    if (!model.pricing) return false;

    const pricing = model.pricing;
    return (
        priceIsZero(pricing.prompt) &&
        priceIsZero(pricing.completion) &&
        priceIsZero(pricing.request)
    );
};

const fetchJson = async (url) => {
    if (typeof fetch !== "function") {
        throw new Error("fetch is not available in this Node runtime");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DISCOVERY_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { Accept: "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Model discovery failed with ${response.status}`);
        }

        return response.json();
    } finally {
        clearTimeout(timeout);
    }
};

const discoverOpenRouterFreeModels = async () => {
    if (process.env.OPENROUTER_MODEL_DISCOVERY_DISABLED === "true") {
        return [];
    }

    const now = Date.now();
    if (openRouterCache.expiresAt > now) {
        return openRouterCache.models;
    }

    try {
        const payload = await fetchJson(
            process.env.OPENROUTER_MODELS_URL || OPENROUTER_MODELS_URL
        );
        const discovered = unique(
            (payload.data || [])
                .filter(isFreeOpenRouterModel)
                .map((model) => model.id)
        );

        openRouterCache = {
            expiresAt: now + CACHE_TTL_MS,
            models: discovered,
        };

        return discovered;
    } catch (error) {
        console.log("OpenRouter model discovery skipped:", error.message);
        openRouterCache = {
            expiresAt: now + CACHE_TTL_MS,
            models: [],
        };
        return [];
    }
};

const looksLikeGroqChatModel = (modelId) =>
    /(llama|gemma|mistral|mixtral|qwen|deepseek|gpt-oss|compound)/i.test(modelId) &&
    !/(whisper|tts|playai|guard|safety|embedding|embed)/i.test(modelId);

const discoverGroqModels = async (groq) => {
    if (!groq || process.env.GROQ_MODEL_DISCOVERY_DISABLED === "true") {
        return [];
    }

    const now = Date.now();
    if (groqCache.expiresAt > now) {
        return groqCache.models;
    }

    try {
        const payload = await groq.models.list();
        const data = payload.data || payload.models || [];
        const discovered = unique(
            data
                .map((model) => model.id)
                .filter(Boolean)
                .filter(looksLikeGroqChatModel)
        );

        groqCache = {
            expiresAt: now + CACHE_TTL_MS,
            models: discovered,
        };

        return discovered;
    } catch (error) {
        console.log("Groq model discovery skipped:", error.message);
        groqCache = {
            expiresAt: now + CACHE_TTL_MS,
            models: [],
        };
        return [];
    }
};

const getOpenRouterModelFallbacks = async () =>
    unique([
        process.env.OPENROUTER_MODEL,
        process.env.OPENROUTER_STREAM_MODEL,
        ...splitModelList(process.env.OPENROUTER_MODEL_FALLBACKS),
        OPENROUTER_FREE_ROUTER_MODEL,
        ...STATIC_OPENROUTER_FREE_MODELS,
        ...(await discoverOpenRouterFreeModels()),
    ]);

const getGroqModelFallbacks = async (groq) =>
    unique([
        process.env.GROQ_MODEL,
        process.env.GROQ_STREAM_MODEL,
        ...splitModelList(process.env.GROQ_MODEL_FALLBACKS),
        ...(await discoverGroqModels(groq)),
        ...STATIC_GROQ_CHAT_MODELS,
    ]);

const getGeminiModelFallbacks = () =>
    unique([
        process.env.GEMINI_MODEL,
        ...splitModelList(process.env.GEMINI_MODEL_FALLBACKS),
        ...STATIC_GEMINI_MODELS,
    ]);

const getHuggingFaceModelFallbacks = () =>
    unique([
        process.env.HF_MODEL,
        ...splitModelList(process.env.HF_MODEL_FALLBACKS),
        ...STATIC_HUGGINGFACE_MODELS,
    ]);

module.exports = {
    getOpenRouterModelFallbacks,
    getGroqModelFallbacks,
    getGeminiModelFallbacks,
    getHuggingFaceModelFallbacks,
    OPENROUTER_FREE_ROUTER_MODEL,
};
