import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [dark, setDark] = useState(false);
    const [lang, setLang] = useState('EN');

    const theme = {
        bg: dark ? '#0f1623' : '#f4f4f6',
        cardBg: dark ? '#1a2540' : '#ffffff',
        sidebarBg: dark ? '#141e2e' : '#ffffff',
        topbarBg: dark ? '#141e2e' : '#ffffff',
        border: dark ? '#1e2d45' : '#e5e5ea',
        rowBorder: dark ? '#1e2d45' : '#f0f0f5',
        textPrimary: dark ? '#e8edf5' : '#1d1d1f',
        textMuted: dark ? '#6b8cae' : '#8888a0',
        inputBg: dark ? '#0f1a2e' : '#fafafa',
        hoverBg: dark ? '#1e2d45' : '#fafafa',
        actionBg: dark ? '#0f1a2e' : '#f8f8fa',
    };

    return (
        <AppContext.Provider value={{ dark, setDark, lang, setLang, theme }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}