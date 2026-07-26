import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AnalysisProvider } from './context/AnalysisContext';
import './styles/tailwind.css';
import './styles/index.css';

ReactDOM.render(
  <React.StrictMode>
    <AnalysisProvider>
      <App />
    </AnalysisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
