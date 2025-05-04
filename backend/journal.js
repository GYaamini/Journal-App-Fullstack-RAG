import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
    j_title: String,
    j_date: {type: Date, default: Date.now},
    j_tags: Array,
    j_content: String
});

const Journal = mongoose.model('Journal', journalSchema);
export default Journal;