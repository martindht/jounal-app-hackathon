import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, index: true },          // Firebase UID
    content: { type: String, required: true, trim: true },       // journal text
    selfReport: { type: Number, required: true, min: 1, max: 10 },// mood slider 1-10
    entryDate: { type: Date, required: true },                   // chosen date/time
    prompt: { type: String, default: null },                     // optional prompt text
    sentimentScore: { type: Number, default: null },             // e.g., -1..1 (or 0..1)
  },
  { timestamps: true }
);

// Timeline index
EntrySchema.index({ uid: 1, entryDate: -1 });

export default mongoose.model("Entry", EntrySchema);
