const Chunk = require("../models/chunk");
const Document = require("../models/document");

const { extractText, createChunks } = require("./pdfProcessor");
const { generateEmbeddings } = require("./embeddingService");

const ingestDocument = async (documentId, filePath) => {
    const pdfData = await extractText(filePath);

    const chunks = await createChunks(pdfData.text);

    const BATCH_SIZE = 20;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);

        const texts = batch.map(chunk => chunk.text);

        const embeddings = await generateEmbeddings(texts);

        const docs = batch.map((chunk, index) => ({
            documentId,
            text: chunk.text,
            chunkIndex: chunk.chunkIndex,
            embedding: embeddings[index],
        }));

        await Chunk.insertMany(docs);
    }

    await Document.findByIdAndUpdate(documentId, {
        status: "ready",
        chunkCount: chunks.length,
    });

    return {
        chunkCount: chunks.length,
    };
};

module.exports = {
    ingestDocument,
};