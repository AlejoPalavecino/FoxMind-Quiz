// 🧮 CONTENIDO — 🔧 EDITABLE: Cambia este valor para ajustar el número de preguntas por partida.
export const TOTAL_QUESTIONS = 6;

// ⏱️ TIEMPO — 🔧 EDITABLE: Cambia este valor para ajustar la duración total del juego en segundos.
export const TIME_LIMIT_SECONDS = 60;

// ⏱️ TIEMPO — 🔧 EDITABLE: Duración (ms) que se muestra el feedback antes de pasar al resumen.
export const FEEDBACK_AUTO_DURATION_MS = 8000;

// ⏱️ TIEMPO — 🔧 EDITABLE: Duración (ms) que se muestra el resumen antes de volver al inicio.
export const SUMMARY_AUTO_DURATION_MS = 5000;

// 🗂️ ESTRUCTURA: Clave utilizada para guardar y recuperar el leaderboard en localStorage.
// 🛠️ CÓMO CAMBIAR: Si necesitas diferentes leaderboards, cambia esta clave para evitar colisiones.
export const LEADERBOARD_KEY = 'foxmind_quiz_leaderboard';