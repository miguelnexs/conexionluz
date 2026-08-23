import React, { createContext, useContext, useState } from 'react';

interface TabBarVisibilityContextType {
  isTabBarVisible: boolean;
  setIsTabBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType>({
  isTabBarVisible: true,
  setIsTabBarVisible: () => {},
});

export const TabBarVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState<boolean>(true);

  return (
    <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);
