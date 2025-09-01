
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { getGeminiFeedback, PerformanceData } from '../../services/geminiService';

interface GeminiFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  performanceData: PerformanceData;
}

const GeminiFeedbackModal: React.FC<GeminiFeedbackModalProps> = ({ isOpen, onClose, performanceData }) => {
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchFeedback = async () => {
        setIsLoading(true);
        setError(null);
        setFeedback('');
        try {
          const result = await getGeminiFeedback(performanceData);
          setFeedback(result);
        } catch (err) {
          setError('No se pudo generar el feedback. Inténtalo de nuevo más tarde.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFeedback();
    }
  }, [isOpen, performanceData]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
    >
      <div
        className="bg-light-card dark:bg-dark-card rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="feedback-title" className="font-display text-3xl font-bold text-accent">Feedback Personalizado</h2>
          <Button onClick={onClose} variant="secondary" size="sm" aria-label="Cerrar modal">X</Button>
        </div>
        <div className="overflow-y-auto flex-grow prose dark:prose-invert max-w-none">
          {isLoading && <p>Generando feedback con Gemini... 🧠</p>}
          {error && <p className="text-red-500">{error}</p>}
          {feedback && (
              <div dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, '<br />') }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiFeedbackModal;
