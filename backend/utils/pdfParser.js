import { PDFExtract } from 'pdf.js-extract';
const pdfExtract = new PDFExtract();

export const extractTextFromPDF = async (dataBuffer) => {
    return new Promise((resolve, reject) => {
        console.log("📥 Extracting text using pdf.js-extract...");
        
        pdfExtract.extractBuffer(dataBuffer, {}, (err, data) => {
            if (err) {
                console.error("❌ Extraction Error:", err);
                return reject(err);
            }

            // Saare pages se text nikal kar merge karna
            const rawText = data.pages
                .map(page => page.content.map(item => item.str).join(' '))
                .join('\n');

            if (!rawText || rawText.trim().length < 2) {
                resolve({ text: "Empty or scanned PDF content.", numpages: data.pages.length });
            } else {
                resolve({
                    text: rawText,
                    numpages: data.pages.length
                });
            }
        });
    });
};