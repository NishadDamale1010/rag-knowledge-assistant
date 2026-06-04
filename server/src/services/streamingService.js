const openrouter = require("../config/openrouter");

const createStream = async (
    context,
    question
) => {
    return openrouter.chat.completions.create({
        model: "deepseek/deepseek-chat-v3:free",

        stream: true,

        messages: [
            {
                role: "system",
                content: `
Answer ONLY using provided context.
Use citations [1], [2].
`
            },
            {
                role: "user",
                content: `
Context:
${context}

Question:
${question}
`
            }
        ]
    });
};

module.exports = {
    createStream
};
