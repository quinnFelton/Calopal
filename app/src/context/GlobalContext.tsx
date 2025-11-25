import { createContext, useContext, useState } from "react";

const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
  const [ActiveFoodID, setActiveFoodID] = useState("");

  return (
    <GlobalContext.Provider value={{ ActiveFoodID, setActiveFoodID }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);