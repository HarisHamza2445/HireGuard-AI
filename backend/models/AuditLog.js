import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
    step: String,
    data: Object,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("AuditLog", auditSchema);
