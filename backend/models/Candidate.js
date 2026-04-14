import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    filename: {
        type: String,
        required: true
    },
    structuredData: {
        type: Object,
        required: true,
        default: {}
    },
    techData: {
        type: Object,
        required: true,
        default: {}
    },
    employmentData: {
        type: Array,
        required: true,
        default: []
    },
    fraudAnalysis: {
        reasoning: { type: String, default: "" },
        contributingFactors: [
            {
                factor: { type: String },
                contributionPercent: { type: Number }
            }
        ]
    },
    riskData: {
        type: Object,
        default: {}
    },
    finalScore: {
        type: Number,
        default: 0
    },
    interviewStatus: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Failed'],
        default: 'Pending'
    },
    interviewScore: {
        type: Number,
        default: null
    },
    interviewFeedback: {
        type: String,
        default: ""
    },
    interviewTranscript: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
});

// Composite index to enforce uniqueness per user per file analysis
candidateSchema.index({ ownerId: 1, 'structuredData.name': 1 }, { unique: true });

const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;
