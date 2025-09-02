import React from 'react';
import Button from './Button';
import { useAccessibility } from '../../hooks/useAccessibility';

const Header: React.FC = () => {
  const { openConfigModal, configButtonRef } = useAccessibility();

  return (
    <header className="py-4 px-6 bg-light-card dark:bg-dark-card shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* 🎨 MARCA — 🔧 EDITABLE: Reemplaza este SVG con tu propio logo.
              🛠️ CÓMO CAMBIAR: Puedes pegar tu propio código SVG aquí o reemplazarlo por un tag <img>.
              Ejemplo: <img src="/assets/logo.png" alt="Mi Logo" className="h-10 w-10" /> */}
            <img src="/assets/logo.png" alt="Mi Logo" className="h-10 w-10" />
          {/* 🎨 MARCA — 🔧 EDITABLE: Cambia el nombre de la aplicación aquí. */}
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-light-text dark:text-dark-text">FoxMind Quiz</h1>
        </div>
        <Button ref={configButtonRef} onClick={openConfigModal} variant="secondary" size="md">
            Configuración
        </Button>
      </div>
    </header>
  );
};

export default Header;