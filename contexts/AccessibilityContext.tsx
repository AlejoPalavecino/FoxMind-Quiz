import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

const FONT_SIZE_KEY = 'foxmind_quiz_fontsize';
const HIGH_CONTRAST_KEY = 'foxmind_quiz_highcontrast';
const TTS_KEY = 'foxmind_quiz_tts';
const VOICE_KEY = 'foxmind_quiz_voice';
const SOUNDS_KEY = 'foxmind_quiz_sounds';

interface AccessibilityContextType {
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  isTtsEnabled: boolean;
  toggleTts: () => void;
  speak: (text: string, options?: { interrupt?: boolean }) => void;
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
  areSoundsEnabled: boolean;
  toggleSounds: () => void;
  resetAccessibilitySettings: () => void;
  isListening: boolean;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isHighContrast, setIsHighContrast] = useState(() => typeof window !== 'undefined' ? localStorage.getItem(HIGH_CONTRAST_KEY) === 'true' : false);
  const [fontSize, setFontSizeState] = useState<number>(() => typeof window !== 'undefined' ? Number(localStorage.getItem(FONT_SIZE_KEY) || 100) : 100);
  const [isTtsEnabled, setIsTtsEnabled] = useState(() => typeof window !== 'undefined' ? localStorage.getItem(TTS_KEY) === 'true' : false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(() => typeof window !== 'undefined' ? localStorage.getItem(VOICE_KEY) === 'true' : false);
  const [areSoundsEnabled, setAreSoundsEnabled] = useState(() => typeof window !== 'undefined' ? localStorage.getItem(SOUNDS_KEY) !== 'false' : true);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isHighContrast) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isHighContrast]);

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
    const clampedSize = Math.max(90, Math.min(160, size));
    setFontSizeState(clampedSize);
    localStorage.setItem(FONT_SIZE_KEY, String(clampedSize));
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
    
    setFontSize(100);
  }, [setFontSize]);
  
  const speak = useCallback((text: string, options: { interrupt?: boolean } = { interrupt: false }) => {
    if (isTtsEnabled && 'speechSynthesis' in window) {
      if(options.interrupt) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-AR';
      window.speechSynthesis.speak(utterance);
    }
  }, [isTtsEnabled]);

  const value = {
    isHighContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    isTtsEnabled,
    toggleTts,
    speak,
    isVoiceEnabled,
    toggleVoice,
    areSoundsEnabled,
    toggleSounds,
    resetAccessibilitySettings,
    isListening,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;