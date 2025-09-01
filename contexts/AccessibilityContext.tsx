import React, { createContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';

// 🗂️ ESTRUCTURA: Claves utilizadas en localStorage para persistir las preferencias del usuario.
// 🛠️ CÓMO CAMBIAR: Si cambias una clave aquí, asegúrate de que no haya datos antiguos con la clave anterior que quieras migrar.
const FONT_SIZE_KEY = 'foxmind_quiz_fontsize';
const HIGH_CONTRAST_KEY = 'foxmind_quiz_highcontrast';
const TTS_KEY = 'foxmind_quiz_tts';
const VOICE_KEY = 'foxmind_quiz_voice';
const SOUNDS_KEY = 'foxmind_quiz_sounds';
const SOUND_VOLUME_KEY = 'foxmind_quiz_volume';

// 🔧 EDITABLE: Define los porcentajes de tamaño de fuente disponibles en el modal de configuración.
export const FONT_STEPS = [90, 100, 120, 140, 160];
// 🔧 EDITABLE: Define los niveles de volumen (en %) disponibles.
export const VOLUME_STEPS = [0, 25, 50, 75, 100];


interface AccessibilityContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  cycleFontSize: (direction: 'up' | 'down') => void;
  isTtsEnabled: boolean;
  toggleTts: () => void;
  speak: (text: string, options?: { interrupt?: boolean }) => void;
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
  areSoundsEnabled: boolean;
  toggleSounds: () => void;
  soundVolume: number;
  setSoundVolume: (level: number) => void;
  resetAccessibilitySettings: () => void;
  isListening: boolean;
  isConfigModalOpen: boolean;
  openConfigModal: () => void;
  closeConfigModal: () => void;
  configButtonRef: React.RefObject<HTMLButtonElement>;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const getInitialValue = (key: string, defaultValue: string, validValues?: string[]): string => {
    if (typeof window === 'undefined') return defaultValue;
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) return defaultValue;
    if (validValues && !validValues.includes(storedValue)) return defaultValue;
    return storedValue;
};

// ♿ ACCESIBILIDAD: Al iniciar, busca la preferencia de tamaño de fuente guardada.
const getInitialFontSize = (): number => {
    if (typeof window === 'undefined') return 100;
    const rawValue = localStorage.getItem(FONT_SIZE_KEY);
    if (rawValue === null) return 100;

    const storedSize = Number(rawValue);
    // Normaliza el valor guardado al paso más cercano para mantener consistencia.
    const closestStep = FONT_STEPS.reduce((prev, curr) =>
      Math.abs(curr - storedSize) < Math.abs(prev - storedSize) ? curr : prev
    );
    return closestStep;
};

const getInitialVolume = (): number => {
    if (typeof window === 'undefined') return 50;
    const rawValue = localStorage.getItem(SOUND_VOLUME_KEY);
    if (rawValue === null) return 50;
    const storedVolume = Number(rawValue);
    const closestStep = VOLUME_STEPS.reduce((prev, curr) =>
        Math.abs(curr - storedVolume) < Math.abs(prev - storedVolume) ? curr : prev
    );
    return closestStep;
}

/**
 * Proveedor de contexto para todas las funcionalidades de accesibilidad.
 * Gestiona el estado y la persistencia en localStorage.
 */
const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(() => getInitialValue(HIGH_CONTRAST_KEY, 'false') === 'true');
  const [fontSize, setFontSizeState] = useState<number>(getInitialFontSize);
  const [isTtsEnabled, setIsTtsEnabled] = useState(() => getInitialValue(TTS_KEY, 'false') === 'true');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => getInitialValue(VOICE_KEY, 'false') === 'true');
  const [areSoundsEnabled, setAreSoundsEnabled] = useState(() => getInitialValue(SOUNDS_KEY, 'true') !== 'false');
  const [soundVolume, setSoundVolumeState] = useState<number>(getInitialVolume);
  const [isListening, setIsListening] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const configButtonRef = useRef<HTMLButtonElement>(null);

  // Aplica/remueve la clase 'dark' para el modo de alto contraste.
  useEffect(() => {
    const root = window.document.documentElement;
    if (isHighContrast) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isHighContrast]);

  // Aplica el tamaño de fuente al elemento raíz.
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.fontSize = `${fontSize}%`;
  }, [fontSize]);
  
  const toggleHighContrast = useCallback(() => setIsHighContrast(prev => {
    const newState = !prev;
    localStorage.setItem(HIGH_CONTRAST_KEY, String(newState));
    return newState;
  }), []);

  const toggleTts = useCallback(() => setIsTtsEnabled(prev => {
    const newState = !prev;
    localStorage.setItem(TTS_KEY, String(newState));
    return newState;
  }), []);

  const toggleVoice = useCallback(() => setIsVoiceEnabled(prev => {
    const newState = !prev;
    localStorage.setItem(VOICE_KEY, String(newState));
    return newState;
  }), []);
  
  const toggleSounds = useCallback(() => setAreSoundsEnabled(prev => {
    const newState = !prev;
    localStorage.setItem(SOUNDS_KEY, String(newState));
    return newState;
  }), []);

  const setFontSize = useCallback((size: number) => {
    const validSize = FONT_STEPS.includes(size) ? size : 100;
    setFontSizeState(validSize);
    localStorage.setItem(FONT_SIZE_KEY, String(validSize));
  }, []);
  
  const cycleFontSize = useCallback((direction: 'up' | 'down') => {
    const currentIndex = FONT_STEPS.indexOf(fontSize);
    const nextIndex = Math.max(0, Math.min(FONT_STEPS.length - 1, currentIndex + (direction === 'up' ? 1 : -1)));
    const newSize = FONT_STEPS[nextIndex];
    if (newSize !== fontSize) {
        setFontSize(newSize);
    }
  }, [fontSize, setFontSize]);

  const setSoundVolume = useCallback((level: number) => {
    const validLevel = VOLUME_STEPS.includes(level) ? level : 50;
    setSoundVolumeState(validLevel);
    localStorage.setItem(SOUND_VOLUME_KEY, String(validLevel));
  }, []);

  const resetAccessibilitySettings = useCallback(() => {
    setIsHighContrast(false);
    localStorage.setItem(HIGH_CONTRAST_KEY, 'false');
    
    setIsTtsEnabled(false);
    localStorage.setItem(TTS_KEY, 'false');

    setIsVoiceEnabled(false);
    localStorage.setItem(VOICE_KEY, 'false');
    
    setAreSoundsEnabled(true);
    localStorage.setItem(SOUNDS_KEY, 'true');

    setSoundVolume(50);
    
    setFontSize(100);
  }, [setFontSize, setSoundVolume]);
  
  /**
   * Lee un texto en voz alta utilizando la API de síntesis de voz del navegador.
   * @param text El texto a leer.
   * @param options Opciones como `interrupt` para detener cualquier lectura anterior.
   */
  const speak = useCallback((text: string, options: { interrupt?: boolean } = { interrupt: false }) => {
    if (isTtsEnabled && 'speechSynthesis' in window) {
      if(options.interrupt) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      // 🔧 EDITABLE: Cambia el código de idioma para adaptar la voz del TTS a tu público.
      // Ejemplos: 'es-ES' (España), 'en-US' (EE.UU. Inglés).
      utterance.lang = 'es-AR';
      window.speechSynthesis.speak(utterance);
    }
  }, [isTtsEnabled]);

  const openConfigModal = useCallback(() => setIsConfigModalOpen(true), []);
  const closeConfigModal = useCallback(() => {
    setIsConfigModalOpen(false);
    // ♿ ACCESIBILIDAD: Devuelve el foco al botón que abrió el modal para una navegación fluida.
    configButtonRef.current?.focus();
  }, []);

  const value = {
    isHighContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    cycleFontSize,
    isTtsEnabled,
    toggleTts,
    speak,
    isVoiceEnabled,
    toggleVoice,
    areSoundsEnabled,
    toggleSounds,
    soundVolume,
    setSoundVolume,
    resetAccessibilitySettings,
    isListening,
    isConfigModalOpen,
    openConfigModal,
    closeConfigModal,
    configButtonRef,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;