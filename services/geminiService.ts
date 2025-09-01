
import { GoogleGenAI } from "@google/genai";
import { type Area } from "../types";

// IMPORTANT: This relies on an environment variable `process.env.API_KEY` being set.
// In a Vite/Create React App setup, this would be `import.meta.env.VITE_API_KEY` or `process.env.REACT_APP_API_KEY`.
// For this environment, we assume `process.env.API_KEY` is directly available.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });

export interface PerformanceData {
  totalQuestions: number;
  totalCorrect: number;
  totalTimeSeconds: number;
  byArea: { [key in Area]: { correct: number; total: number } };
  weakestArea: Area | null;
  sessionResults: { area: Area; isCorrect: boolean }[];
}

const FALLBACK_FEEDBACK = `
¡Buen trabajo completando el desafío!

**Fortalezas:**
- Demostraste una buena capacidad para responder bajo presión.
- Se nota que tienes conocimientos sólidos en varias de las áreas evaluadas.

**Sugerencias:**
- Intenta repasar los conceptos básicos del área donde tuviste más dificultades.
- La práctica constante es clave. ¡Sigue jugando para mejorar tu velocidad y precisión!

¡Sigue así!
`;

export async function getGeminiFeedback(data: PerformanceData): Promise<string> {
    if (!apiKey) {
        return Promise.resolve(FALLBACK_FEEDBACK);
    }

    const prompt = `
Eres un coach educativo. Redacta un feedback en español (entre 120 y 150 palabras), claro y motivador. El tono debe ser amable y profesional, sin regaños.

Datos del desempeño (JSON):
${JSON.stringify({
    totalQuestions: data.totalQuestions,
    totalCorrect: data.totalCorrect,
    totalTimeSeconds: data.totalTimeSeconds,
    byArea: data.byArea,
    weakestArea: data.weakestArea,
    results: data.sessionResults,
})}

Instrucciones:
- Incluye 2 fortalezas específicas basadas en los datos (ej: "Excelente precisión en Matemática" o "Gran velocidad de respuesta").
- Incluye 2 sugerencias de mejora concretas y accionables.
- Incluye 1 micro-recomendación para el área con peor desempeño. Si todas las áreas fueron perfectas, felicita por el dominio general.
- Formatea la respuesta con saltos de línea para que sea fácil de leer.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("Empty response from Gemini");
    }
    return text;

  } catch (error) {
    console.error("Gemini API error:", error);
    return FALLBACK_FEEDBACK;
  }
}
