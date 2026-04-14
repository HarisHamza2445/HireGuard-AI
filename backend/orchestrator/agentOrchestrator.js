import { resumeAgent } from "../agents/resumeAgent.js";
import { employmentAgent } from "../agents/employmentAgent.js";
import { techAgent } from "../agents/techAgent.js";
import { riskAgent } from "../agents/riskAgent.js";
import AuditLog from "../models/AuditLog.js";

export const runVerification = async (resumeText) => {

    const structuredData = await resumeAgent(resumeText);

    await AuditLog.create({
        step: "Resume Intelligence Agent",
        data: structuredData
    });

    const employmentData = employmentAgent(structuredData.companies);

    await AuditLog.create({
        step: "Employment Verification Agent",
        data: employmentData
    });

    const techData = techAgent(
        structuredData.github,
        structuredData.skills
    );

    await AuditLog.create({
        step: "Technical Intelligence Agent",
        data: techData
    });

    const riskData = riskAgent(
        employmentData,
        techData
    );

    const fraudAnalysis = structuredData.fraudAnalysis;
    delete structuredData.fraudAnalysis;

    await AuditLog.create({
        step: "Risk Assessment Agent",
        data: riskData
    });

    return {
        structuredData,
        employmentData,
        techData,
        riskData,
        fraudAnalysis
    };
};
