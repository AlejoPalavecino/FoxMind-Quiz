
import { type Question, Area } from '../types';
import { TOTAL_QUESTIONS } from '../constants';

const questions: Question[] = [
    // Matemática
    { id: 1, area: Area.Matematica, prompt: "48 ÷ 6 = ?", options: ["6", "7", "8", "9"], correctIndex: 2, explanation: "6 por 8 es 48." },
    { id: 2, area: Area.Matematica, prompt: "37 + 28 = ?", options: ["55", "65", "64", "66"], correctIndex: 1, explanation: "30+20=50, 7+8=15. 50+15=65." },
    { id: 3, area: Area.Matematica, prompt: "Perímetro de un rectángulo de lados 8 y 5:", options: ["13", "26", "40", "16"], correctIndex: 1, explanation: "El perímetro es 2 * (largo + ancho), entonces 2 * (8 + 5) = 26." },
    { id: 4, area: Area.Matematica, prompt: "15 × 7 = ?", options: ["95", "85", "90", "105"], correctIndex: 3, explanation: "10*7=70, 5*7=35. 70+35=105." },
    { id: 5, area: Area.Matematica, prompt: "Área de un triángulo (base 10, altura 6):", options: ["60", "30", "16", "32"], correctIndex: 1, explanation: "El área es (base * altura) / 2, entonces (10 * 6) / 2 = 30." },
    { id: 6, area: Area.Matematica, prompt: "96 - 57 = ?", options: ["49", "39", "41", "29"], correctIndex: 1, explanation: "96 - 50 = 46. 46 - 7 = 39." },
    // Lengua
    { id: 7, area: Area.Lengua, prompt: "¿Cuál oración está bien puntuada?", options: ["“Cuándo vienes?”", "“¿Cuándo vienes?”", "“¿Cuándo vienes?.”", "“Cuándo, vienes?”"], correctIndex: 1, explanation: "Las preguntas en español deben llevar signos de interrogación al principio y al final." },
    { id: 8, area: Area.Lengua, prompt: "Sujeto en: “Ayer, en la escuela, explicó el profesor las reglas.”", options: ["Ayer", "la escuela", "el profesor", "las reglas"], correctIndex: 2, explanation: "El sujeto es quien realiza la acción del verbo 'explicó'." },
    { id: 9, area: Area.Lengua, prompt: "Sinónimo de “conciso”:", options: ["largo", "detallado", "breve", "complicado"], correctIndex: 2, explanation: "Conciso significa que expresa mucho con pocas palabras." },
    { id: 10, area: Area.Lengua, prompt: "Función de “con atención” en “Leí el informe con atención”:", options: ["Objeto Directo", "Sujeto", "Modificador Circunstancial", "Predicado"], correctIndex: 2, explanation: "Indica el modo en que se realizó la acción." },
    { id: 11, area: Area.Lengua, prompt: "¿Qué palabra lleva tilde por ser esdrújula?", options: ["dialogo", "dialogó", "diálogo", "dialogar"], correctIndex: 2, explanation: "Las palabras esdrújulas siempre llevan tilde en la antepenúltima sílaba." },
    { id: 12, area: Area.Lengua, prompt: "La palabra “plausible” significa:", options: ["aplaudible", "verosímil", "complicado", "sencillo"], correctIndex: 1, explanation: "Algo plausible es algo que parece creíble o admisible." },
    // Ciencias Naturales
    { id: 13, area: Area.CsNaturales, prompt: "Función principal de los alvéolos pulmonares:", options: ["Filtrar aire", "Producir moco", "Intercambio gaseoso", "Calentar el aire"], correctIndex: 2, explanation: "En los alvéolos, el oxígeno pasa a la sangre y el dióxido de carbono sale de ella." },
    { id: 14, area: Area.CsNaturales, prompt: "Ejemplo de una planta gimnosperma:", options: ["manzano", "rosa", "pino", "helecho"], correctIndex: 2, explanation: "Las gimnospermas, como los pinos, tienen semillas desnudas (no en un fruto)." },
    { id: 15, area: Area.CsNaturales, prompt: "¿Qué sistema corporal coordina respuestas rápidas a estímulos?", options: ["Sistema endocrino", "Sistema nervioso", "Sistema circulatorio", "Sistema digestivo"], correctIndex: 1, explanation: "El sistema nervioso utiliza impulsos eléctricos para respuestas casi instantáneas." },
    { id: 16, area: Area.CsNaturales, prompt: "Vitamina que la piel sintetiza con la exposición al sol:", options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina K"], correctIndex: 2, explanation: "La vitamina D es crucial para la absorción de calcio." },
    { id: 17, area: Area.CsNaturales, prompt: "¿Cuál de estos es un recurso natural no renovable?", options: ["Energía solar", "Viento", "Madera", "Petróleo"], correctIndex: 3, explanation: "El petróleo se formó durante millones de años y sus reservas son finitas." },
    { id: 18, area: Area.CsNaturales, prompt: "Principal órgano encargado de filtrar la sangre:", options: ["Hígado", "Pulmones", "Riñones", "Estómago"], correctIndex: 2, explanation: "Los riñones eliminan desechos y exceso de líquido de la sangre para producir orina." },
    // Ciencias Sociales (Argentina)
    { id: 19, area: Area.CsSociales, prompt: "¿En qué año ocurrió la Revolución de Mayo?", options: ["1816", "1810", "1853", "1910"], correctIndex: 1, explanation: "El 25 de mayo de 1810 se formó el Primer Gobierno Patrio." },
    { id: 20, area: Area.CsSociales, prompt: "Grupo inmigrante más numeroso en Argentina (fines s. XIX-ppios s. XX):", options: ["española", "alemana", "italiana", "polaca"], correctIndex: 2, explanation: "La gran inmigración italiana dejó una profunda huella cultural en el país." },
    { id: 21, area: Area.CsSociales, prompt: "José de San Martín es conocido como el Libertador de:", options: ["Argentina", "Argentina y Chile", "Argentina, Chile y Perú", "Sudamérica"], correctIndex: 2, explanation: "Su campaña militar fue crucial para la independencia de estos tres países." },
    { id: 22, area: Area.CsSociales, prompt: "La Constitución Nacional Argentina fue sancionada en:", options: ["1810", "1816", "1853", "1983"], correctIndex: 2, explanation: "La Constitución de 1853 sentó las bases de la organización del estado argentino." },
    { id: 23, area: Area.CsSociales, prompt: "La Ley Sáenz Peña de 1912 estableció:", options: ["El fin de la esclavitud", "La educación gratuita", "El voto secreto y obligatorio para hombres", "El voto femenino"], correctIndex: 2, explanation: "Esta ley fue un hito en la ampliación de la democracia en Argentina." },
    { id: 24, area: Area.CsSociales, prompt: "El 9 de Julio se conmemora la:", options: ["Revolución de Mayo", "Declaración de la Independencia", "Batalla de San Lorenzo", "Fundación de Buenos Aires"], correctIndex: 1, explanation: "El 9 de julio de 1816 se declaró la independencia de las Provincias Unidas del Río de la Plata." }
];

function shuffle<T,>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

export const getQuizQuestions = (): Question[] => {
    const shuffled = shuffle([...questions]);
    const questionsByArea = {
        [Area.Matematica]: [] as Question[],
        [Area.Lengua]: [] as Question[],
        [Area.CsNaturales]: [] as Question[],
        [Area.CsSociales]: [] as Question[],
    };

    shuffled.forEach(q => {
        questionsByArea[q.area].push(q);
    });

    const selectedQuestions: Question[] = [];
    const usedIds = new Set<number>();

    // 1. Get one guaranteed question from each area
    (Object.keys(questionsByArea) as Area[]).forEach(area => {
        const question = questionsByArea[area].shift();
        if (question) {
            selectedQuestions.push(question);
            usedIds.add(question.id);
        }
    });

    // 2. Fill the rest with random questions
    const remainingQuestions = shuffled.filter(q => !usedIds.has(q.id));
    
    while (selectedQuestions.length < TOTAL_QUESTIONS && remainingQuestions.length > 0) {
        const question = remainingQuestions.shift();
        if(question) {
            selectedQuestions.push(question);
        }
    }
    
    return shuffle(selectedQuestions);
};
