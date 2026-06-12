import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SESSION_KEY = "mirage_embedded";

interface EmbeddedContextValue {
  isEmbedded: boolean;
}

const EmbeddedContext = createContext<EmbeddedContextValue>({ isEmbedded: false });

interface EmbeddedProviderProps {
  children: React.ReactNode;
}

export const EmbeddedProvider = ({ children }: EmbeddedProviderProps) => {
  const [searchParams] = useSearchParams();

  const [isEmbedded] = useState<boolean>(() => {
    // Si le flag est déjà en session, on le réutilise
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      return true;
    }
    // Sinon on regarde la query string
    if (searchParams.get("embedded") === "1") {
      sessionStorage.setItem(SESSION_KEY, "1");
      return true;
    }
    return false;
  });

  useEffect(() => {
    // Sécurité : si la query arrive après le montage (navigation client-side vers /)
    if (searchParams.get("embedded") === "1" && sessionStorage.getItem(SESSION_KEY) !== "1") {
      sessionStorage.setItem(SESSION_KEY, "1");
    }
  }, [searchParams]);

  return (
    <EmbeddedContext.Provider value={{ isEmbedded }}>
      {children}
    </EmbeddedContext.Provider>
  );
};

export const useEmbedded = (): EmbeddedContextValue => useContext(EmbeddedContext);
