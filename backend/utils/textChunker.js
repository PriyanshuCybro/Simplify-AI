/**
 * split text into chunks for better AI Processing
 * @param {string} text - full text into chunk
 * @param {number} chunkSize - Target size per chunk (in words)
 * @param {number} overlap - Overlapping words between chunks
 * @returns {Array} Array of text chunks
 */
export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) {
        return [];
    }

    // Clean text while preserving paragraph structure
    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n\s*\n+/g, '\n\n')
        .trim();

    // Split by paragraph
    const paragraphs = cleanedText.split(/\n\n+/).filter((p) => p.trim().length > 0);

    const chunks = [];
    let currentChunkWords = [];
    let currentWordCount = 0;
    let chunkCounter = 0;

    for (const paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;

        // If a single paragraph is larger than the chunkSize, split it
        if (paragraphWordCount > chunkSize) {
            // Push existing progress first
            if (currentChunkWords.length > 0) {
                chunks.push({
                    content: currentChunkWords.join(' '),
                    pageNumber: 0,
                    chunkIndex: chunkCounter++,
                });
                currentChunkWords = [];
                currentWordCount = 0;
            }

            // Split the oversized paragraph
            for (let i = 0; i < paragraphWords.length; i += (chunkSize - overlap)) {
                const slice = paragraphWords.slice(i, i + chunkSize);
                chunks.push({
                    content: slice.join(' '),
                    pageNumber: 0,
                    chunkIndex: chunkCounter++,
                });
                if (i + chunkSize >= paragraphWords.length) break;
            }
            continue;
        }

        // If adding this paragraph exceeds limit, finalize current chunk
        if (currentWordCount + paragraphWordCount > chunkSize && currentChunkWords.length > 0) {
            chunks.push({
                content: currentChunkWords.join(' '),
                pageNumber: 0,
                chunkIndex: chunkCounter++,
            });

            // Create overlap for the next chunk
            const overlapWords = currentChunkWords.slice(-Math.min(overlap, currentChunkWords.length));
            currentChunkWords = [...overlapWords, ...paragraphWords];
            currentWordCount = currentChunkWords.length;
        } else {
            currentChunkWords.push(...paragraphWords);
            currentWordCount += paragraphWordCount;
        }
    }

    // Add the final remaining chunk
    if (currentChunkWords.length > 0) {
        chunks.push({
            content: currentChunkWords.join(' '),
            pageNumber: 0,
            chunkIndex: chunkCounter,
        });
    }

    return chunks;
};

/**
 * Find relevant chunks based on keyword matching
 */
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
    if (!chunks || chunks.length === 0 || !query) return [];

    // Common stop words
    const stopWords = new Set([
        'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'of', 'for', 'as', 'this', 'that', 'it'
    ]);

    const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 2 && !stopWords.has(word));

    if (queryWords.length === 0) {
        return chunks.slice(0, maxChunks).map(chunk => ({
            content: chunk.content,
            pageNumber: chunk.pageNumber,
            chunkIndex: chunk.chunkIndex,
            _id: chunk._id,
        }));
    }

    const scoredChunks = chunks.map((chunk, index) => {
        const content = chunk.content.toLowerCase();
        let score = 0;
        const wordsInChunk = chunk.content.split(/\s+/).length;

        for (const word of queryWords) {
            // Escape special characters for Regex
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Exact word match
            const exactMatches = (content.match(new RegExp(`\\b${escapedWord}\\b`, 'g')) || []).length;
            score += exactMatches * 3;

            // Partial match
            const partialMatches = (content.match(new RegExp(escapedWord, 'g')) || []).length;
            score += Math.max(0, partialMatches - exactMatches) * 1.5;
        }

        const uniqueWordsFound = queryWords.filter(word => content.includes(word)).length;
        if (uniqueWordsFound > 1) {
            score += uniqueWordsFound * 2;
        }

        const lengthNormalizedScore = score / Math.sqrt(wordsInChunk || 1);
        const positionBonus = 1 - (index / chunks.length * 0.1);

        return {
            content: chunk.content,
            pageNumber: chunk.pageNumber,
            chunkIndex: chunk.chunkIndex,
            _id: chunk._id,
            score: lengthNormalizedScore * positionBonus,
            matchedWords: uniqueWordsFound,
        };
    });

    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxChunks);
};