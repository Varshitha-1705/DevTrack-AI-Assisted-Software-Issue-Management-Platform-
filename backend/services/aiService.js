const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeTicket = async (title, description) => {
  const prompt = `
You are an AI software support triage assistant.

Analyze the following software issue and return ONLY valid JSON.

Issue Title:
${title}

Issue Description:
${description}

Return exactly this structure:

{
  "category": "bug | feature | security | performance | other",
  "severity": "low | medium | high | critical",
  "priority": "low | medium | high | urgent",
  "suggestedTeam": "Frontend Engineering | Backend Engineering | Security Engineering | DevOps | QA | Other",
  "suggestedAction": "short recommended next step"
}

Do not include markdown.
Do not include explanations outside the JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text.trim();

  return JSON.parse(text);
};

module.exports = {
  analyzeTicket,
};