import { GoogleGenAI } from "@google/genai";
import { type Area } from "../types";

// 🔐 SEGURIDAD: La clave de API NUNCA debe estar hardcodeada en el código fuente.
// Se debe configurar como una variable de entorno en tu plataforma de despliegue.
// Para desarrollo local, puedes crear un archivo .env y usar una herramienta como Vite o Create React App
// que la cargue automáticamente en `process.env.API_KEY` (o similar, ej: `import.meta.env.VITE_API_KEY`).
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

// 🧮 CONTENIDO — 🔧 EDITABLE: Este es el texto que se mostrará si la llamada a la API de Gemini falla.
// Puedes personalizarlo para que se ajuste al tono de tu aplicación.
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

/**
 * Genera feedback personalizado para el usuario basado en su desempeño en el quiz.
 * @param data - Un objeto con los datos de rendimiento del usuario.
 * @returns Una cadena de texto con el feedback.
 */
export async function getGeminiFeedback(data: PerformanceData): Promise<string> {
    if (!apiKey) {
        return Promise.resolve(FALLBACK_FEEDBACK);
    }

    // 🔧 EDITABLE: Este es el prompt que se envía a la API de Gemini.
    // 🛠️ CÓMO CAMBIAR: Puedes ajustar el tono, la longitud (ej. 100-120 palabras),
    // el idioma, o las instrucciones para que el feedback se adapte mejor a tu público.
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
      // 🔧 EDITABLE: Puedes cambiar el modelo de Gemini por otro que se ajuste a tus necesidades.
      // Por ejemplo, 'gemini-1.5-pro-latest' si necesitas más capacidad de razonamiento.
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // 🔧 EDITABLE: Ajusta la 'temperatura' para controlar la creatividad de la respuesta.
        // Un valor más bajo (ej. 0.3) la hace más predecible; un valor más alto (ej. 0.9) la hace más creativa.
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