# FoxMind Quiz - Proyecto Base

Este repositorio contiene el código fuente de **FoxMind Quiz**, una aplicación de trivia accesible e interactiva, potenciada por la API de Gemini para generar feedback personalizado.

## Características Principales

- **Quiz Interactivo**: 6 preguntas de opción múltiple contra un reloj de 60 segundos.
- **Categorías Variadas**: Preguntas de Matemática, Lengua, Ciencias Naturales y Ciencias Sociales.
- **Feedback con IA**: Al finalizar, la API de Gemini analiza tu desempeño y te da consejos personalizados.
- **Leaderboard**: Guarda tus mejores puntuaciones y compite por el primer lugar.
- **Accesibilidad (WCAG AA)**:
  - Modo de alto contraste.
  - Tamaño de fuente ajustable.
  - Lector de pantalla (TTS) para preguntas y opciones.
  - Navegación completa por teclado.
  - Diseño responsivo (móvil, tablet, escritorio).

---

## 🚀 Puntos de Personalización Rápida

Este proyecto está diseñado para ser fácilmente personalizable. A continuación, se detallan los archivos clave que puedes modificar para adaptar el quiz a tu propia marca y contenido.

### 1. Logo y Marca
- **Archivo**: `components/ui/Header.tsx`
- **Qué cambiar**: Reemplaza el código SVG en línea por tu propio logo. Puedes usar un tag `<img>` si lo prefieres. También puedes cambiar el nombre "FoxMind Quiz" en el `<h1>`.

### 2. Colores y Tipografías
- **Archivo**: `index.html`
- **Qué cambiar**:
    - **Colores**: Dentro de la etiqueta `<script>` que contiene `tailwind.config`, modifica los valores en `theme.extend.colors` para definir tu paleta (`primary`, `accent`, etc.).
    - **Tipografías**: Cambia el enlace de Google Fonts en el `<head>` y actualiza los nombres de las fuentes en `tailwind.config` en la sección `theme.extend.fontFamily`.

### 3. Duración del Quiz y Nº de Preguntas
- **Archivo**: `constants.ts`
- **Qué cambiar**:
    - `TOTAL_QUESTIONS`: Define cuántas preguntas tendrá cada partida.
    - `TIME_LIMIT_SECONDS`: Establece la duración total del temporizador en segundos.

### 4. Banco de Preguntas
- **Archivo**: `services/questionService.ts`
- **Qué cambiar**: Modifica el array `questions` para añadir, eliminar o editar las preguntas. Asegúrate de mantener la estructura del objeto y tener suficientes preguntas para que la selección aleatoria funcione correctamente.

### 5. Criterios del Leaderboard
- **Archivo**: `services/leaderboardService.ts`
- **Qué cambiar**:
    - La función `getLeaderboard` ordena las puntuaciones. Puedes cambiar la lógica en `entries.sort()` si prefieres otro criterio (p. ej., solo por tiempo).
    - La función `saveScore` decide si un nuevo puntaje reemplaza a uno viejo. Puedes ajustar esta lógica para permitir múltiples entradas por nick o cambiar cómo se actualizan.

### 6. Configuración de Gemini API
- **Archivo**: `services/geminiService.ts`
- **Qué cambiar**:
    - **API Key**: **Nunca** escribas tu clave directamente en el código. Configúrala como una variable de entorno (`process.env.API_KEY`).
    - **Modelo**: Puedes cambiar el modelo de Gemini (ej. `gemini-2.5-flash`) por otro que se ajuste mejor a tus necesidades.
    - **Prompt**: Modifica el texto del `prompt` para cambiar el tono, la longitud o el contenido del feedback que genera la IA.
    - **Fallback**: Edita el `FALLBACK_FEEDBACK` para controlar el mensaje que se muestra si la API falla.

### 7. Idioma de Texto a Voz (TTS)
- **Archivo**: `contexts/AccessibilityContext.tsx`
- **Qué cambiar**: En la función `speak`, puedes cambiar el idioma de la voz modificando `utterance.lang = 'es-AR'`. Por ejemplo, a `'en-US'` para inglés o `'es-ES'` para español de España.
