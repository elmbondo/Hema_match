
import { GoogleGenAI } from "@google/genai";
import { BloodType } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateDonorSMS(donorName: string, bloodType: BloodType, urgency: 'HIGH' | 'MEDIUM') {
    const prompt = `
      Generate a persuasive and polite SMS message to a blood donor named ${donorName} who has blood type ${bloodType}.
      The urgency level is ${urgency}.
      Context: Nairobi Referral Hospital is experiencing a shortage.
      Keep it under 160 characters. 
      Include a clear call to action.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.8,
        },
      });
      return response.text;
    } catch (error) {
      console.error("Gemini SMS Generation Error:", error);
      return `URGENT: ${donorName}, Nairobi Referral Hospital needs your ${bloodType} blood donation. Please visit us today.`;
    }
  }
}

export const geminiService = new GeminiService();
