import Candidate from '../models/Candidate.js';

// @desc    Get all candidates for logged in user
// @route   GET /api/candidates
// @access  Private
export const getCandidates = async (req, res) => {
    try {
        // Fetch candidates owned by the req.user
        const candidates = await Candidate.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: candidates.length, data: candidates });
    } catch (error) {
        console.error('Fetch Candidates Error:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching candidate directory' });
    }
};

// @desc    Get single candidate by ID
// @route   GET /api/candidates/:id
// @access  Private
export const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ _id: req.params.id, ownerId: req.user.id });

        if (!candidate) {
            return res.status(404).json({ success: false, message: 'Candidate not found or unauthorized access' });
        }

        res.status(200).json({ success: true, data: candidate });
    } catch (error) {
        console.error('Fetch Candidate ID Error:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching individual candidate' });
    }
};

// @desc    Get macro-level recruiter analytics (Averages, Totals, Trends)
// @route   GET /api/candidates/analytics
// @access  Private
export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Calculate Core Metrics: Total Processed, Avg Risk, High-Risk Count
        const metricsPipeline = await Candidate.aggregate([
            { $match: { ownerId: userId } },
            {
                $group: {
                    _id: null,
                    totalResumes: { $sum: 1 },
                    averageRisk: { $avg: "$riskScore" },
                    highRiskCount: {
                        $sum: { $cond: [{ $gt: ["$riskScore", 70] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalResumes: 1,
                    averageRisk: { $round: ["$averageRisk", 1] }, // Round to 1 decimal
                    highRiskPercentage: {
                        $cond: [
                            { $eq: ["$totalResumes", 0] },
                            0,
                            { $round: [{ $multiply: [{ $divide: ["$highRiskCount", "$totalResumes"] }, 100] }, 1] }
                        ]
                    }
                }
            }
        ]);

        const metricsList = metricsPipeline[0] || { totalResumes: 0, averageRisk: 0, highRiskPercentage: 0 };

        // 2. Calculate 6-Month Hiring Trend Graph (Counts per month)
        // Groups candidate ingestions by month/year of their createdAt timestamp
        const trendPipeline = await Candidate.aggregate([
            { $match: { ownerId: userId } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 6 } // Lookback window: 6 months
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let formattedTrends = trendPipeline.map(item => ({
            name: `${monthNames[item._id.month - 1]}`,
            year: item._id.year,
            monthIndex: item._id.month,
            Scans: item.count
        }));

        formattedTrends.reverse();

        if (formattedTrends.length === 0) {
            formattedTrends = [
                { name: "Month 1", Scans: 0 },
                { name: "Month 2", Scans: 0 }
            ];
        }

        res.status(200).json({
            success: true,
            analytics: {
                ...metricsList,
                trendData: formattedTrends
            }
        });

    } catch (error) {
        console.error('Fetch Analytics Error:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving macro analytics' });
    }
};
