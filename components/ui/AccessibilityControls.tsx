import React, { useEffect } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import Button from './Button';

interface SwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SwitchControl: React.FC<SwitchProps> = ({ id, label, checked, onChange }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className="inline-flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="absolute w-1 h-1 opacity-0"
        aria-hidden="true"
      />
      <label
        htmlFor={id}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`inline-flex items-center gap-1.5 py-1.5 px-3 border rounded-full cursor-pointer select-none leading-none transition-colors
          ${checked ? 'border-accent bg-accent/10' : 'border-gray-300 dark:border-gray-600'}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-card`}
      >
        <span
          aria-hidden="true"
          className={`w-4 h-4 rounded-full transition-colors ${
            checked ? 'bg-accent' : 'bg-gray-400 dark:bg-gray-500'
          }`}
        />
        {label}
      </label>
    </div>
  );
};


const AccessibilityControls: React.FC = () => {
  const {
    isHighContrast, toggleHighContrast,
    isTtsEnabled, toggleTts,
    isVoiceEnabled, toggleVoice,
    areSoundsEnabled, toggleSounds,
    fontSize, setFontSize,
    resetAccessibilitySettings,
  } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      const activeEl = document.activeElement?.tagName?.toLowerCase();
      if (['input', 'textarea', 'button'].includes(activeEl || '')) {
        return;
      }
      
      const key = ev.key.toLowerCase();
      if (key === 'h') {
        ev.preventDefault();
        toggleHighContrast();
      } else if (key === '+' || key === '=') {
        ev.preventDefault();
        setFontSize(Math.min(160, fontSize + 5));
      } else if (key === '-') {
        ev.preventDefault();
        setFontSize(Math.max(90, fontSize - 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleHighContrast, setFontSize, fontSize]);


  return (
    <div className="mt-6">
      <fieldset
        role="group"
        aria-label="Controles de accesibilidad"
        className="flex items-center gap-4 p-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto [&>*]:whitespace-nowrap"
      >
        <SwitchControl id="swHC" label="Alto Contraste" checked={isHighContrast} onChange={toggleHighContrast} />
        <SwitchControl id="swTTS" label="TTS" checked={isTtsEnabled} onChange={toggleTts} />
        <SwitchControl id="swVoice" label="Voz" checked={isVoiceEnabled} onChange={toggleVoice} />
        <SwitchControl id="swSnd" label="Sonidos" checked={areSoundsEnabled} onChange={toggleSounds} />
        
        <div className="flex items-center gap-2">
          <label htmlFor="fontRange" className="font-bold">Tamaño</label>
          <input
            id="fontRange"
            type="range"
            min="90"
            max="160"
            step="5"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-[120px] md:w-[150px] align-middle accent-primary"
            aria-label="Tamaño de fuente"
            aria-valuemin={90}
            aria-valuemax={160}
            aria-valuenow={fontSize}
            aria-valuetext={`${fontSize}%`}
          />
          <span id="fontVal" className="inline-block py-px px-2 rounded-full bg-gray-200 dark:bg-slate-600 text-sm font-semibold">
            {fontSize}%
          </span>
        </div>
        
        <Button onClick={resetAccessibilitySettings} variant="secondary" size="sm" className="!ml-auto">
          Restablecer
        </Button>
      </fieldset>
    </div>
  );
};

export default AccessibilityControls;