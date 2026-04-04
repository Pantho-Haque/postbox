"use client";
import {
  TPostBoxCollections,
  TPostBoxCurlJson,
  TPostBoxSelectorResponse,
  TResponseJson,
} from "@/types";
import { jsonToCurl } from "@/utils/curlConverter";
import { formatJson } from "@/utils/formatJson";
import { updateCurl } from "@/utils/postboxCollectionModifier";

import { AlertCircle, MessageCircleWarning } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useExtension } from "@/hooks/useExtension";
import {
  NoExtensionModal,
  ResponsePanel,
  TabEditor,
  UrlBar,
} from "@/components";

export default function RequestForm({
  selectorResponse,
  setCollections,
  setSelectorResponse,
}: {
  selectorResponse: TPostBoxSelectorResponse;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelectorResponse: Dispatch<
    SetStateAction<TPostBoxSelectorResponse | null>
  >;
}) {
  const { collectionName, curlName, env, curlJson, responseJson } =
    selectorResponse;

  const [error, setError] = useState<string | null>(null);

  const { available: extensionAvailable, checked: extensionChecked } =
    useExtension();

  const [formInput, setFormInput] = useState<TPostBoxCurlJson>({
    ...curlJson,
    body: formatJson(curlJson.body).output,
    headers: formatJson(curlJson.headers).output,
  });

  const [proxyResponse, setProxyResponse] = useState<TResponseJson>(
    responseJson ?? null,
  );

  const isUnsaved = useCallback(() => {
    const normalize = (s: string) => {
      try {
        return JSON.stringify(JSON.parse(s || "{}"));
      } catch {
        return s.trim();
      }
    };
    return (
      formInput.method !== curlJson.method ||
      formInput.url !== curlJson.url ||
      normalize(formInput.body) !== normalize(curlJson.body) ||
      normalize(formInput.headers) !== normalize(curlJson.headers) ||
      normalize(JSON.stringify(proxyResponse)) !==
        normalize(JSON.stringify(responseJson))
    );
  }, [
    curlJson.body,
    curlJson.headers,
    curlJson.method,
    curlJson.url,
    formInput.body,
    formInput.headers,
    formInput.method,
    formInput.url,
    proxyResponse,
    responseJson,
  ]);

  const handleSaveCollection = useCallback(() => {
    setSelectorResponse({
      collectionName,
      curlName,
      env,
      curlJson: formInput,
      responseJson: proxyResponse,
    });
    setCollections((prev) =>
      updateCurl(
        prev,
        collectionName,
        curlName,
        jsonToCurl(formInput),
        JSON.stringify(proxyResponse),
      ),
    );
  }, [
    setSelectorResponse,
    collectionName,
    curlName,
    env,
    formInput,
    proxyResponse,
    setCollections,
  ]);

  useEffect(() => {
    const temp = () => {
      setFormInput({
        ...curlJson,
        body: formatJson(curlJson.body).output,
        headers: formatJson(curlJson.headers).output,
      });
      setError(null);
      setProxyResponse(responseJson ?? null);
    };
    temp();
  }, [curlJson, responseJson]);

  return (
    <div className="h-full w-full flex flex-col gap-4 font-mono">
      <NoExtensionModal
        checked={extensionChecked}
        available={extensionAvailable}
      />

      <div className="flex items-center gap-2">
        <span className="text-[9px] tracking-[0.25em] uppercase text-cyan-500/40">
          {collectionName}
        </span>
        <span className="text-white/10 text-xs">/</span>
        <span className="text-[9px] tracking-[0.25em] uppercase text-cyan-500/70">
          {curlName}
        </span>
      </div>

      <UrlBar
        formInput={formInput}
        setFormInput={setFormInput}
        setProxyResponse={setProxyResponse}
        extensionAvailable={extensionAvailable}
        env={env}
        handleSaveCollection={handleSaveCollection}
        error={error}
        isUnsaved={isUnsaved}
      />

      {(isUnsaved() || error) && (
        <div className="flex items-center gap-2">
          {isUnsaved() && !error && (
            <span className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
              <MessageCircleWarning className="h-3 w-3" strokeWidth={2.5} />
              Unsaved · Ctrl/Cmd+S
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1.5 rounded-md bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-400 border border-red-500/20">
              <AlertCircle className="h-3 w-3" strokeWidth={2.5} />
              {error}
            </span>
          )}
        </div>
      )}

      <TabEditor
        formInput={formInput}
        setFormInput={setFormInput}
        setError={setError}
      />
      <ResponsePanel proxyResponse={proxyResponse} />
    </div>
  );
}
