import { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  isAccessibilityMode: boolean;
  toggleAccessibilityMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAccessibilityMode, setIsAccessibilityMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('accessibilityMode');
    return stored === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isAccessibilityMode) {
      root.classList.add('accessibility-mode');
    } else {
      root.classList.remove('accessibility-mode');
    }

    localStorage.setItem('accessibilityMode', String(isAccessibilityMode));
  }, [isAccessibilityMode]);

  const toggleAccessibilityMode = () => {
    setIsAccessibilityMode(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider value={{ isAccessibilityMode, toggleAccessibilityMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
