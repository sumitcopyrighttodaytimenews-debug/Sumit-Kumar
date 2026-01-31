
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Option } from "../types";

export const processOMRImage = async (
  base64Image: string,
  answerKey: Question[]
): Promise<{ detectedAnswers: { q: number; o: string }[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this OMR (Optical Mark Recognition) sheet image.
    Identify which bubble (A, B, C, D, or E) is filled for each question number.
    
    Expected OMR Layout Info:
    - Questions are numbered from 1 to ${answerKey.length}.
    - Bubbles are circular and darker when filled.
    
    Return a JSON object containing an array of detected answers.
    If multiple bubbles are filled for a single question, mark the option as "MULTIPLE".
    If no bubble is filled, mark it as "NONE".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedAnswers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  q: { type: Type.INTEGER, description: "Question number" },
                  o: { type: Type.STRING, description: "Detected option (A, B, C, D, E, MULTIPLE, or NONE)" }
                },
                required: ["q", "o"]
              }
            }
          },
          required: ["detectedAnswers"]
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini OMR Error:", error);
    throw error;
  }
};
