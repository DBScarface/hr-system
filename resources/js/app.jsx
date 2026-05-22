//
import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
    return (
        <div>
            <h1>HR System is alive 🚀</h1>
        </div>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);