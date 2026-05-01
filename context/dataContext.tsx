import { createContext, useContext, useState, ReactNode, useEffect, SetStateAction, Dispatch } from "react";
import { TPostBoxCollections, TPostBoxSelectorResponse } from "@/types";
import { GetPostboxCollections } from "@/services";

const DataContext = createContext<{
  collections: TPostBoxCollections;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  selectorResponse: TPostBoxSelectorResponse | null;
  setSelectorResponse: Dispatch<SetStateAction<TPostBoxSelectorResponse | null>>;
  hasCollections: boolean;
} | null>(null);


export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [collections, setCollections] = useState<TPostBoxCollections>(
    GetPostboxCollections(),
  );
  const [selectorResponse, setSelectorResponse] =
    useState<TPostBoxSelectorResponse | null>(null);

  useEffect(() => {
    localStorage.setItem("postbox", JSON.stringify(collections));
  }, [collections]);

  const hasCollections = collections.length > 0;

  return (
    <DataContext.Provider
      value={{
        collections,
        setCollections,
        hasCollections,
        selectorResponse,
        setSelectorResponse,

      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
