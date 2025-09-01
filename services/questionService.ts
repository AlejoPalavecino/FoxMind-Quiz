import { type Question, Area } from '../types';
import { TOTAL_QUESTIONS } from '../constants';

// 🧮 CONTENIDO — 🔧 EDITABLE: Este es el banco de preguntas del quiz.
// 🛠️ CÓMO CAMBIAR:
// 1. Agrega o elimina objetos de pregunta en este array.
// 2. Mantén la estructura: { id, area, prompt, options, correctIndex, explanation }.
// 3. `options` debe tener siempre 4 elementos.
// 4. `correctIndex` es la posición de la respuesta correcta (0, 1, 2, o 3).
// 5. Asegúrate de tener suficientes preguntas (al menos 1 por área, idealmente más de 24 en total para variedad).
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
    { id: 24, area: Area.CsSociales, prompt: "El 9 de Julio se conmemora la:", options: ["Revolución de Mayo", "Declaración de la Independencia", "Batalla de San Lorenzo", "Fundación de Buenos Aires"], correctIndex: 1, explanation: "El 9 de julio de 1816 se declaró la independencia de las Provincias Unidas del Río de la Plata." },
    // --- Nuevas preguntas ---
    // Matemática
    { id: 25, area: Area.Matematica, prompt: "72 ÷ 8 = ¿?", options: ["6", "8", "9", "12"], correctIndex: 2, explanation: "72 dividido 8 es 9." },
    { id: 26, area: Area.Matematica, prompt: "¿Cuál es el 25% de 240?", options: ["40", "50", "60", "80"], correctIndex: 2, explanation: "El 25% es 1/4: 240 ÷ 4 = 60." },
    { id: 27, area: Area.Matematica, prompt: "Perímetro de un triángulo equilátero de lado 7", options: ["14", "21", "28", "49"], correctIndex: 1, explanation: "Perímetro = 3 × 7 = 21." },
    { id: 28, area: Area.Matematica, prompt: "(12 − 4) × 3 + 6 =", options: ["18", "24", "30", "36"], correctIndex: 2, explanation: "Primero paréntesis: 8 × 3 = 24; 24 + 6 = 30." },
    // Lengua
    { id: 29, area: Area.Lengua, prompt: "¿Cuál de las siguientes es una oración bimembre?", options: ["Lluvia todo el día.", "¡Qué frío!", "La maestra explicó el tema.", "Silencio en clase."], correctIndex: 2, explanation: "“La maestra explicó el tema” tiene sujeto y predicado (bimembre)." },
    { id: 30, area: Area.Lengua, prompt: "Elegí la forma correcta:", options: ["Porque llegaste tarde?", "¿Porqué llegaste tarde?", "¿Por qué llegaste tarde?", "¿Por que llegaste tarde?"], correctIndex: 2, explanation: "Interrogativa directa: “¿Por qué…?” separado y con tilde en “qué”." },
    { id: 31, area: Area.Lengua, prompt: "En “El libro que compré es interesante”, “que” funciona como…", options: ["conjunción copulativa", "pronombre relativo", "artículo determinado", "preposición"], correctIndex: 1, explanation: "“que” introduce una subordinada adjetiva: pronombre relativo." },
    { id: 32, area: Area.Lengua, prompt: "Completá: “No vino a la reunión; ___, envió su informe por correo.”", options: ["sin embargo", "por lo tanto", "además", "aunque"], correctIndex: 0, explanation: "Contrasta la ausencia con el envío del informe: “sin embargo”." },
    // Ciencias Naturales
    { id: 33, area: Area.CsNaturales, prompt: "En la fotosíntesis, la planta consume principalmente…", options: ["oxígeno", "nitrógeno", "dióxido de carbono", "hidrógeno"], correctIndex: 2, explanation: "Usa CO₂ y libera oxígeno." },
    { id: 34, area: Area.CsNaturales, prompt: "¿Qué orgánulo celular produce mayormente la energía?", options: ["núcleo", "aparato de Golgi", "mitocondria", "lisosoma"], correctIndex: 2, explanation: "La mitocondria realiza la respiración celular y produce ATP." },
    { id: 35, area: Area.CsNaturales, prompt: "La sublimación es el cambio de estado de…", options: ["sólido a líquido", "líquido a gas", "sólido a gas", "gas a líquido"], correctIndex: 2, explanation: "Sólido → gas (p.ej., hielo seco)." },
    { id: 36, area: Area.CsNaturales, prompt: "Tejido que transporta savia elaborada en plantas", options: ["xilema", "floema", "cámbium", "periderma"], correctIndex: 1, explanation: "El floema lleva azúcares desde las hojas al resto de la planta." },
    // Ciencias Sociales (Argentina)
    { id: 37, area: Area.CsSociales, prompt: "¿En qué año comenzó la presidencia de Domingo F. Sarmiento?", options: ["1816", "1853", "1868", "1912"], correctIndex: 2, explanation: "Sarmiento gobernó 1868–1874." },
    { id: 38, area: Area.CsSociales, prompt: "La Guerra de la Triple Alianza (1864–1870) enfrentó a la alianza contra…", options: ["Chile", "Paraguay", "Perú", "Bolivia"], correctIndex: 1, explanation: "Argentina, Brasil y Uruguay lucharon contra Paraguay." },
    { id: 39, area: Area.CsSociales, prompt: "La Ley Sáenz Peña (1912) estableció…", options: ["sufragio femenino obligatorio", "voto secreto, universal (masculino) y obligatorio", "voto cantado y voluntario", "elecciones indirectas"], correctIndex: 1, explanation: "Introdujo el voto secreto, universal masculino y obligatorio." },
    { id: 40, area: Area.CsSociales, prompt: "¿Quién escribió la letra del Himno Nacional Argentino?", options: ["José de San Martín", "Vicente López y Planes", "Bartolomé Mitre", "Domingo F. Sarmiento"], correctIndex: 1, explanation: "Letra: Vicente López y Planes; música: Blas Parera." }
];

const RECENT_IDS_KEY = 'foxmind_quiz_recent_ids';
const RECENT_IDS_MAX = 12; // Guarda las últimas 12 preguntas para evitar repetirlas.

const getRecentIds = (): number[] => {
    try {
        return JSON.parse(localStorage.getItem(RECENT_IDS_KEY) || '[]');
    } catch {
        return [];
    }
};

export const pushRecentIds = (newIds: number[]): void => {
    try {
        const prevIds = getRecentIds();
        const nextIds = [...newIds, ...prevIds].slice(0, RECENT_IDS_MAX);
        localStorage.setItem(RECENT_IDS_KEY, JSON.stringify(nextIds));
    } catch (error) {
        console.error("Failed to save recent question IDs", error);
    }
};

/**
 * Baraja un array en su lugar utilizando el algoritmo Fisher-Yates.
 * @param array El array a barajar.
 * @returns El mismo array, pero barajado.
 */
function shuffle<T,>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

/**
 * Selecciona un conjunto de preguntas para una nueva partida de quiz.
 * Garantiza una distribución equilibrada de áreas temáticas y evita repetir preguntas recientes.
 * 🔧 EDITABLE: Puedes cambiar la lógica de selección para, por ejemplo,
 * tener más preguntas de un área específica o hacerla completamente aleatoria.
 * @returns {Question[]} Un array de preguntas barajadas para la partida.
 */
export const getQuizQuestions = (): Question[] => {
    const recentIds = new Set(getRecentIds());
    
    // Clasifica todas las preguntas por área.
    const questionsByArea = {
        [Area.Matematica]: [] as Question[],
        [Area.Lengua]: [] as Question[],
        [Area.CsNaturales]: [] as Question[],
        [Area.CsSociales]: [] as Question[],
    };
    questions.forEach(q => {
        questionsByArea[q.area].push(q);
    });

    // Helper para elegir una pregunta, evitando recientes si es posible.
    const pickOne = (questionList: Question[]): Question | undefined => {
        const nonRecentPool = questionList.filter(q => !recentIds.has(q.id));
        const pool = nonRecentPool.length > 0 ? nonRecentPool : questionList;
        if (pool.length === 0) return undefined;
        return pool[Math.floor(Math.random() * pool.length)];
    };
    
    const selectedQuestions: Question[] = [];
    const usedIds = new Set<number>();

    // 1. Obtiene una pregunta garantizada de cada área.
    (Object.keys(questionsByArea) as Area[]).forEach(area => {
        const question = pickOne(questionsByArea[area]);
        if (question && !usedIds.has(question.id)) {
            selectedQuestions.push(question);
            usedIds.add(question.id);
        }
    });

    // 2. Rellena las preguntas restantes con una selección aleatoria de las no utilizadas.
    const remainingPool = questions.filter(q => !usedIds.has(q.id));
    
    while (selectedQuestions.length < TOTAL_QUESTIONS && remainingPool.length > 0) {
        const nonRecentRemaining = remainingPool.filter(q => !recentIds.has(q.id));
        const poolToPickFrom = nonRecentRemaining.length > 0 ? nonRecentRemaining : remainingPool;

        const pick = poolToPickFrom[Math.floor(Math.random() * poolToPickFrom.length)];
        
        selectedQuestions.push(pick);
        usedIds.add(pick.id);

        const indexToRemove = remainingPool.findIndex(q => q.id === pick.id);
        if (indexToRemove > -1) {
            remainingPool.splice(indexToRemove, 1);
        }
    }
    
    // Baraja el conjunto final para que no aparezcan siempre en el mismo orden de área.
    return shuffle(selectedQuestions);
};