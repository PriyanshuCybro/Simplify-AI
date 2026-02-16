import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a document title'],
        trim: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    filesize: {
        type: Number,
        required: true
    },
    extractedText: {
        type: String,
        default: ""
    },
    chunks: [{
        content: { type: String, required: true },
        chunkIndex: { type: Number, required: true }
    }],
    status: {
        type: String,
        enum: ["processing", "ready", "failed"],
        default: "processing"
    }
}, {
    timestamps: true
});

documentSchema.index({ userId: 1, createdAt: -1 });

const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);
export default Document;