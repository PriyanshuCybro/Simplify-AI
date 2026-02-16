import { PDFExtract } from 'pdf.js-extract';
const pdfExtract = new PDFExtract();

export const extractTextFromPDF = async (dataBuffer) => {
    return new Promise((resolve, reject) => {
        pdfExtract.extractBuffer(dataBuffer, {}, (err, data) => {
            if (err) return resolve({ text: "Extraction failed", numpages: 0 });
            const rawText = data.pages
                .map(page => page.content.map(item => item.str).join(' '))
                .join('\n');
            resolve({ text: rawText, numpages: data.pages.length });
        });
    });
};