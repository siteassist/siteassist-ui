import type { Assistant, SiteAssistClient } from "siteassist-core";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface SiteAssistContextValue {
  assistant: Assistant | null;
  isProjectLoaded: boolean;
  client: SiteAssistClient;
}

export const SiteAssistContext = createContext<SiteAssistContextValue | null>(
  null
);

export interface SiteAssistProviderProps {
  children: ReactNode;
  client: SiteAssistClient;
}

export function SiteAssistProvider({
  client,
  children,
}: SiteAssistProviderProps) {
  const [isProjectLoaded, setIsProjectLoaded] = useState(false);
  const [assistant, setAssistant] = useState<Assistant | null>(null);

  const loadProject = useCallback(async () => {
    setIsProjectLoaded(false);
    const project = await client.getAssistant();
    setAssistant(project);
    setIsProjectLoaded(true);
  }, [client]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  return (
    <SiteAssistContext.Provider value={{ assistant, isProjectLoaded, client }}>
      {children}
    </SiteAssistContext.Provider>
  );
}

export const useSiteAssist = () => {
  const context = useContext(SiteAssistContext);
  if (!context) {
    throw new Error("useSiteAssist must use insdie SiteAssistProvider");
  }
  return context;
};
