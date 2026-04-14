export const employmentAgent = (companies) => {
    const knownCompanies = ["Google", "Amazon", "Microsoft", "Meta"];

    // Handle case where companies might be undefined or not an array
    if (!Array.isArray(companies)) {
        return [];
    }

    const results = companies.map(companyData => {
        // The previous prompt returned companies as an array of objects ({name: "Company", experience_years: 2})
        // But the new prompt assumes it's an array of strings. Handling both just in case.
        const companyName = typeof companyData === 'object' && companyData.name ? companyData.name : companyData;

        if (knownCompanies.includes(companyName)) {
            return {
                company: companyName,
                verified: true,
                credibilityScore: 90,
                risk: 10
            };
        }

        return {
            company: companyName,
            verified: false,
            credibilityScore: 40,
            risk: 35
        };
    });

    return results;
};
