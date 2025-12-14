import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Initializing BattleZone App...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App mounted successfully.");
} catch (error) {
  console.error("Failed to mount React app:", error);
  rootElement.innerHTML = `
    <div style="color: #f87171; padding: 20px; font-family: sans-serif;">
      <h2>Application Failed to Load</h2>
      <p>See console for details.</p>
      <pre style="background: rgba(0,0,0,0.3); padding: 10px; overflow: auto;">${error}</pre>
    </div>
  `;
}