import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { JobSeekerProfile } from '../types';

const API_KEY = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
    if (!API_KEY) {
        throw new Error("Gemini AI is unavailable in this preview. Configure GEMINI_API_KEY to enable AI features.");
    }

    if (!ai) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }

    return ai;
};

const buildPrompt = (profile: JobSeekerProfile): string => {
  const experienceText = profile.workExperience
    .map(exp => `- ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate}): ${exp.description}`)
    .join('\\n');
    
  const educationText = profile.education
    .map(edu => `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}.`)
    .join('\\n');

  const skillsText = profile.skills.map(skill => skill.name).join(', ');

  return `
    Based on the following professional profile, write a compelling and concise summary (2-3 sentences) for a hiring manager. 
    Highlight the key strengths, years of experience, and technical expertise. 
    Adopt a professional and confident tone.

    **Profile Details:**
    ---
    **Name:** ${profile.name}
    **Location:** ${profile.location}
    
    **Work Experience:**
    ${experienceText}

    **Education:**
    ${educationText}

    **Key Skills:**
    ${skillsText}
    ---
    
    Generate the summary now.
  `;
};

export const generateProfileSummary = async (profile: JobSeekerProfile): Promise<string> => {
    const prompt = buildPrompt(profile);
    
    try {
        const response: GenerateContentResponse = await getAIClient().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating profile summary with Gemini:", error);
        if (error instanceof Error && error.message.includes("Gemini AI is unavailable")) {
            throw error;
        }
        throw new Error("Failed to generate profile summary. Please try again.");
    }
};
