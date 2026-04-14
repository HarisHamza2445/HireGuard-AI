export const riskAgent = (employmentData, techData) => {

    // Safeguard in case employmentData is empty
    let employmentRisk = 0;
    if (employmentData && employmentData.length > 0) {
        employmentRisk =
            employmentData.reduce((acc, item) => acc + item.risk, 0) /
            employmentData.length;
    }

    const technicalRisk = techData ? techData.technicalRisk : 0;

    // Weighted Model
    const fraudProbability =
        (employmentRisk * 0.6) +
        (technicalRisk * 0.4);

    let level = "Low";

    if (fraudProbability > 60) level = "High";
    else if (fraudProbability > 30) level = "Medium";

    const confidenceScore = 100 - fraudProbability;

    return {
        fraudProbability: Math.round(fraudProbability),
        level,
        confidenceScore: Math.round(confidenceScore),
        breakdown: {
            employmentRisk: Math.round(employmentRisk),
            technicalRisk: Math.round(technicalRisk)
        }
    };
};
