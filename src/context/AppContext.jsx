import React, { useState, createContext, useContext } from 'react';

// Create the context
const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {

  const [config, setConfig] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [isShowingSearch, setIsShowingSearch] = useState(false);
  const [mapLocations, setMapLocations] = useState([]);
  const [mapSearchText, setMapSearchText] = useState("");
  const [focusMapPin, setFocusMapPin] = useState("");

  return (
    <AppContext.Provider value={{
      isLoading,
      setIsLoading,
      isLoadingAdmin,
      setIsLoadingAdmin,
      isExpanded,
      setIsExpanded,
      isExploded,
      setIsExploded,
      mapLocations,
      setMapLocations,
      focusMapPin,
      setFocusMapPin,
      isShowingSearch,
      setIsShowingSearch,
      mapSearchText,
      setMapSearchText,
      config,
      setConfig,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);