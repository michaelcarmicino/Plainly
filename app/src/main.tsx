import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App.tsx';
import './ui/styles.css';
import './ui/stiliNavigazione.css';
import './ui/stiliHome.css';
import './ui/stiliSimulazione.css';
import './ui/stiliRisultato.css';
import './ui/stiliFonti.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root non trovato in index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
