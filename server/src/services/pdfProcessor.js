const fs = require("fs");
const pdfParse = require("pdf-parse");
const {
    RecursiveCharacterTextSplitter,
} = require("@langchain/textsplitters");

const extractText = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);

        const pdfData = await pdfParse(dataBuffer);

        console.log("Pages:", pdfData.numpages);
        console.log("Text Length:", pdfData.text.length);
        console.log(
            "Preview:",
            pdfData.text.substring(0, 200)
        );

        return {
            text: pdfData.text,
            numPages: pdfData.numpages,
        };
    } catch (error) {
        console.error(
            "Error extracting text from PDF:",
            error
        );
        throw error;
    }
};

const createChunks = async (text) => {
    try {
        const splitter =
            new RecursiveCharacterTextSplitter({
                chunkSize: 500,
                chunkOverlap: 50,
            });

        const chunks = await splitter.splitText(text);

        console.log(
            `Created ${chunks.length} chunks`
        );

        return chunks.map((chunk, index) => ({
            text: chunk,
            chunkIndex: index,
        }));
    } catch (error) {
        console.error(
            "Error creating chunks:",
            error
        );
        throw error;
    }
};

module.exports = {
    extractText,
    createChunks,
};