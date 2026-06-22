import React, { createContext, useState, useRef } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [mode, setMode] = useState('user'); // 'user' | 'worker'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [confirm, setConfirm] = useState(null); // { title, message, onConfirm, onCancel }
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

  return (
    <AppContext.Provider
      value={{
        mode,
        toggleMode,
        sidebarOpen,
        openSidebar,
        closeSidebar,
        toast,
        showToast,
        confirm,
        showConfirm,
        closeConfirm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
