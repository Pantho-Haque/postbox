import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  SetStateAction,
  Dispatch,
  useCallback,
} from "react";
import {
  TPostBoxCollections,
  TPostBoxCurlJson,
  TPostBoxSelectorResponse,
  TResponseJson,
} from "@/types";
import { GetPostboxCollections } from "@/services";
import { useExtension } from "@/hooks/useExtension";
import { formatJson } from "@/utils/formatJson";
import { jsonToCurl } from "@/utils/curlConverter";
import { updateCurl } from "@/utils/postboxCollectionModifier";

const DataContext = createContext<{
  collections: TPostBoxCollections;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  selectorResponse: TPostBoxSelectorResponse | null;
  setSelectorResponse: Dispatch<
    SetStateAction<TPostBoxSelectorResponse | null>
  >;
  hasCollections: boolean;

  formInput: TPostBoxCurlJson;
  setFormInput: Dispatch<SetStateAction<TPostBoxCurlJson>>;
  proxyResponse: TResponseJson;
  setProxyResponse: Dispatch<SetStateAction<TResponseJson>>;
  isUnsaved: () => boolean;

  extensionAvailable: boolean;
  extensionChecked: boolean;

  handleSaveCollection: () => void;
} | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { available: extensionAvailable, checked: extensionChecked } =
    useExtension();
  const [collections, setCollections] = useState<TPostBoxCollections>(
    GetPostboxCollections(),
  );
  const [selectorResponse, setSelectorResponse] =
    useState<TPostBoxSelectorResponse | null>(null);

  const [formInput, setFormInput] = useState<TPostBoxCurlJson>({
    url: selectorResponse?.curlJson?.url ?? "",
    method: selectorResponse?.curlJson?.method ?? "GET",
    headers: formatJson(selectorResponse?.curlJson?.headers ?? "").output,
    body: formatJson(selectorResponse?.curlJson?.body ?? "").output,
    params: selectorResponse?.curlJson?.params ?? "",
  });

  const [proxyResponse, setProxyResponse] = useState<TResponseJson>(
    selectorResponse?.responseJson ?? null,
  );

  const handleSaveCollection = useCallback(() => {
      setSelectorResponse({
        ...selectorResponse!,
        curlJson: formInput,
        responseJson: proxyResponse,
      });
      setCollections((prev) =>
        updateCurl(
          prev,
          selectorResponse!.collectionName,
          selectorResponse!.curlName,
          jsonToCurl(formInput),
          JSON.stringify(proxyResponse),
        ),
      );
    }, [selectorResponse, formInput, proxyResponse]);

  useEffect(() => {
    localStorage.setItem("postbox", JSON.stringify(collections));
  }, [collections]);

  const hasCollections = collections.length > 0;
  const isUnsaved = useCallback(() => {
    if (!selectorResponse || !formInput) return false;
    return jsonToCurl(selectorResponse.curlJson) !== jsonToCurl(formInput);
  }, [selectorResponse, formInput]);

  return (
    <DataContext.Provider
      value={{
        collections,
        setCollections,
        hasCollections,
        selectorResponse,
        setSelectorResponse,

        formInput,
        setFormInput,
        proxyResponse,
        setProxyResponse,
        isUnsaved,

        extensionAvailable,
        extensionChecked,

        handleSaveCollection,
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
