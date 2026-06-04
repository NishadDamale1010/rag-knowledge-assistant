const fs = require('fs');
const pdfParse = require('pdf-parse');
const extractText = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);

        const pdfData = await pdfParse(dataBuffer);

        console.log("Pages:", pdfData.numpages);
        console.log("Text length:", pdfData.text.length);
        console.log("Preview:", pdfData.text.substring(0, 200));

        return {
            text: pdfData.text,
            numPages: pdfData.numpages,
        };
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw error;
    }
};
module.exports = {
    extractText,
};