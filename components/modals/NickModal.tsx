import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';

interface NickModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (nick: string) => void;
}

const NickModal: React.FC<NickModalProps> = ({ isOpen, onClose, onStart }) => {
  const [nick, setNick] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog?.showModal();
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      dialog?.close();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNick = nick.trim();
    // ♿ ACCESIBILIDAD: Validación de patrón para el nombre de usuario (3-18 caracteres).
    if (/^[A-Za-zÁÉÍÓÚÜÑ0-9_\- ]{3,18}$/.test(trimmedNick)) {
      onStart(trimmedNick);
      setNick(''); // Clear for next time
    } else {
      // Basic validation feedback
      inputRef.current?.focus();
      inputRef.current?.setCustomValidity('Por favor, ingresa un nombre válido (3-18 caracteres, sin símbolos especiales).');
      inputRef.current?.reportValidity();
    }
  };
  
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNick(e.target.value);
    e.target.setCustomValidity(''); // Clear custom message on new input
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="config bg-light-card dark:bg-dark-card text-light-text dark:text-dark-text p-0"
      // FIX: Se añade un estilo en línea para anular el ancho de la clase 'config', 
      // asegurando que el modal tenga un tamaño adecuado para su contenido y se vea centrado.
      style={{ width: 'min(420px, 90vw)' }}
      aria-labelledby="nick-title"
      aria-describedby="nick-desc"
    >
      <form
        method="dialog"
        onSubmit={handleSubmit}
        // FIX: Se elimina 'max-w-sm' para que el formulario ocupe todo el ancho del diálogo redimensionado.
        className="p-6 flex flex-col gap-4 w-full"
      >
        <header>
          {/* 🧮 CONTENIDO — 🔧 EDITABLE: Textos del modal para pedir el nombre de usuario. */}
          <h2 id="nick-title" className="font-display text-2xl font-bold text-center">¿Cómo te llamás?</h2>
          <p id="nick-desc" className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
            Este nombre se usará para guardar tu resultado en el leaderboard.
          </p>
        </header>
        
        <label htmlFor="nickInput" className="sr-only">Tu nombre o nick</label>
        <input
          ref={inputRef}
          id="nickInput"
          name="nick"
          type="text"
          value={nick}
          onChange={handleInput}
          placeholder="Tu nombre (3–18 caracteres)"
          className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary w-full"
          pattern="[A-Za-zÁÉÍÓÚÜÑ0-9_\- ]{3,18}"
          required
          minLength={3}
          maxLength={18}
        />
        
        <footer className="flex justify-end gap-3 mt-2">
          <Button type="button" onClick={onClose} variant="secondary">Cancelar</Button>
          <Button type="submit" variant="primary">Empezar</Button>
        </footer>
      </form>
    </dialog>
  );
};

export default NickModal;
