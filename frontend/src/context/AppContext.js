import React, { createContext, useState, useRef } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [mode, setMode] = useState('user');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [menuPage, setMenuPage] = useState(null); // 'problems' | 'earnings' | 'settings' | 'help' | 'about'
  const toastTimeout = useRef(null);

  const toggleMode = () => setMode(prev => (prev === 'user' ? 'worker' : 'user'));
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const showToast = (message, type = 'info') => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ message, type });
    toastTimeout.current = setTimeout(() => setToast(null), 3000);
  };

  const showConfirm = (title, message, onConfirm, onCancel) => {
    setConfirm({ title, message, onConfirm, onCancel });
  };
  const closeConfirm = () => setConfirm(null);

  const openMenuPage = (page) => { closeSidebar(); setMenuPage(page); };
  const closeMenuPage = () => setMenuPage(null);

  return (
    <AppContext.Provider
      value={{
        mode, toggleMode,
        sidebarOpen, openSidebar, closeSidebar,
        toast, showToast,
        confirm, showConfirm, closeConfirm,
        menuPage, openMenuPage, closeMenuPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
