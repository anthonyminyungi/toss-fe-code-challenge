import 'modern-normalize';
import './modal.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ModalFormPage from './ModalFormPage';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ModalFormPage />
    </StrictMode>,
  );
}
