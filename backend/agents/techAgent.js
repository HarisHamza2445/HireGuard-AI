export const techAgent = (github, skills) => {

    let risk = 0;
    let flags = [];

    // Handle case where skills might be undefined
    const safeSkills = Array.isArray(skills) ? skills : [];

    // Case 1: No GitHub but claims dev skills
    if (!github && safeSkills.some(skill =>
        ["React", "Node", "JavaScript", "MERN", "Full Stack", "Node.js"].includes(skill)
    )) {
        risk += 35;
        flags.push("Claims development skills but no GitHub provided");
    }

    // Case 2: GitHub exists
    if (github) {
        risk += 10; // minimal base risk
    }

    return {
        githubPresent: !!github,
        technicalRisk: risk,
        flags
    };
};
