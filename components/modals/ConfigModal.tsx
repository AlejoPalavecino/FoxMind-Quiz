import React, { useRef, useEffect } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import { FONT_STEPS, VOLUME_STEPS } from '../../contexts/AccessibilityContext';
import Button from '../ui/Button';

// ♿ ACCESIBILIDAD: Componente reutilizable que implementa un radiogrupo accesible.
// Gestiona el foco, los roles ARIA y la navegación por teclado.
interface SegmentedControlProps<T extends string | number> {
  labelId: string;
  options: { value: T; label: string }[];
  selectedValue: T;
  onChange: (value: T) => void;
}

function SegmentedControl<T extends string | number>({
  labelId,
  options,
  selectedValue,
  onChange,
}: SegmentedControlProps<T>) {
  const groupRef = useRef<HTMLDivElement>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const radios = Array.from(groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') || []);
    const currentIndex = options.findIndex(opt => opt.value === selectedValue);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = currentIndex === radios.length - 1 ? 0 : currentIndex + 1;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = currentIndex === 0 ? radios.length - 1 : currentIndex - 1;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = radios.length - 1;
    } else {
      return;
    }

    if (nextIndex !== currentIndex) {
      const nextRadio = radios[nextIndex];
      if (nextRadio) {
        nextRadio.focus();
        onChange(options[nextIndex].value);
      }
    }
  };

  return (
    <div
      ref={groupRef}
      role="radiogrupo"
      aria-labelledby={labelId}
      className="segmented"
      onKeyDown={handleKeyDown}
    >
      {options.map(({ value, label }) => {
        const isChecked = selectedValue === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isChecked}
            tabIndex={isChecked ? 0 : -1}
            onClick={() => onChange(value)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onChange(value);
              }
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}


const ConfigModal: React.FC = () => {
  const {
    isConfigModalOpen,
    closeConfigModal,
    isHighContrast,
    toggleHighContrast,
    isTtsEnabled,
    toggleTts,
    soundVolume,
    setSoundVolume,
    fontSize,
    setFontSize,
    resetAccessibilitySettings,
  } = useAccessibility();
  
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Gestiona la visibilidad del modal nativo <dialog>.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (isConfigModalOpen) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }, [isConfigModalOpen]);

  const handleReset = () => {
    resetAccessibilitySettings();
  };

  // 🧮 CONTENIDO — 🔧 EDITABLE: Cambia las etiquetas de los botones de configuración.
  const FONT_LABELS: { [key: number]: string } = {
    90: 'Pequeño', 100: 'Normal', 120: 'Grande', 140: 'Muy G.', 160: 'Extra G.',
  };
  const VOLUME_LABELS: { [key: number]: string } = {
    0: 'Silencio', 25: 'Bajo', 50: 'Medio', 75: 'Alto', 100: 'Máx.',
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={closeConfigModal}
      onClick={(e) => {
        if (e.currentTarget === e.target) closeConfigModal();
      }}
      className="config bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text"
      aria-labelledby="config-title"
      aria-describedby="config-desc"
    >
      <header>
        {/* 🧮 CONTENIDO — 🔧 EDITABLE: Cambia el título y la descripción del modal. */}
        <h2 id="config-title" className="text-2xl font-display font-bold text-center mb-1">Configuración</h2>
        <p id="config-desc" className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          Personaliza la accesibilidad y la presentación. Los cambios se aplican al instante.
        </p>
      </header>
      
      <div className="space-y-2">
        <div className="config-row">
            <div className="config-row-header">
                <h3 id="conf-hc-label">Alto contraste</h3>
                <p>Mejora la legibilidad con colores de mayor contraste.</p>
            </div>
            <SegmentedControl
                labelId="conf-hc-label"
                options={[{value: 'on', label: 'Activado'}, {value: 'off', label: 'Desactivado'}]}
                selectedValue={isHighContrast ? 'on' : 'off'}
                onChange={() => toggleHighContrast()}
            />
        </div>
        <div className="config-row">
            <div className="config-row-header">
                <h3 id="conf-tts-label">Lectura por voz (TTS)</h3>
                <p>Lee en voz alta las preguntas y opciones.</p>
            </div>
            <SegmentedControl
                labelId="conf-tts-label"
                options={[{value: 'on', label: 'Activado'}, {value: 'off', label: 'Desactivado'}]}
                selectedValue={isTtsEnabled ? 'on' : 'off'}
                onChange={() => toggleTts()}
            />
        </div>
        <div className="config-row">
            <div className="config-row-header">
                <h3 id="conf-vol-label">Volumen de sonidos</h3>
                <p>Ajusta el volumen de los efectos de sonido del juego.</p>
            </div>
            <SegmentedControl
                labelId="conf-vol-label"
                options={VOLUME_STEPS.map(v => ({ value: v, label: VOLUME_LABELS[v] }))}
                selectedValue={soundVolume}
                onChange={(v) => setSoundVolume(v as number)}
            />
        </div>
        <div className="config-row">
            <div className="config-row-header">
                <h3 id="conf-font-label">Tamaño de fuente</h3>
                <p>Cambia el tamaño del texto en toda la aplicación.</p>
            </div>
            <SegmentedControl
                labelId="conf-font-label"
                options={FONT_STEPS.map(v => ({ value: v, label: FONT_LABELS[v] }))}
                selectedValue={fontSize}
                onChange={(v) => setFontSize(v as number)}
            />
        </div>
      </div>

      <footer className="config-actions">
        <Button onClick={handleReset} variant="secondary">Restablecer</Button>
        <Button onClick={closeConfigModal} variant="primary">Cerrar</Button>
      </footer>
    </dialog>
  );
};

export default ConfigModal;