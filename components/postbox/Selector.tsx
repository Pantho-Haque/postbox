import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import {
  CreateModal,
  DeleteModal,
  EnvModal,
  RenameModal,
} from "@/components";
import { curlConverter } from "@/utils/curlConverter";
import { TPostBoxCollections, TPostBoxCurlJson, TPostBoxEnv } from "@/types";

export default function Selector({
  collections,
  envs,
  setEnvs,
  setCollections,
  setSelectedCurlJson,
}: {
  collections: TPostBoxCollections;
  envs: TPostBoxEnv;
  setEnvs: Dispatch<SetStateAction<TPostBoxEnv>>;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelectedCurlJson: Dispatch<SetStateAction<TPostBoxCurlJson>>;
}) {
  const [selectedCollection, setSelectedCollection] = useState<string>(
    collections[0]?.collectionName,
  );

  const selectedRouteList = useCallback(
    () =>
      collections.find((c) => c.collectionName === selectedCollection)?.curls,
    [collections, selectedCollection],
  );

  const [selectedCurlName, setSelectedCurlName] = useState<string>(
    collections[0]?.curls[0]?.name,
  );

  const collectionList = collections.map((c) => c.collectionName) || [];
  const curlList = selectedRouteList()?.map((c) => c.name) || [];

  return (
    <div className="h-full w-[300px] flex z-1">
      <div className="h-full w-[150px] pt-4 bg-gray-50  flex flex-col gap-2">
        <CreateModal
          type="collection"
          collectionList={collectionList}
          curlList={curlList}
          setSelectedCollection={setSelectedCollection}
          setSelectedCurlName={setSelectedCurlName}
          selectedCollection={selectedCollection}
          setCollections={setCollections}
        />
        {collections?.map((collection, i) => {
          return (
            <div
              key={i}
              className={`group/menu flex items-center justify-between pr-2 rounded overflow-visible capitalize font-semibold ${selectedCollection === collection.collectionName ? "border-b-4 border-cyan-500 bg-cyan-100" : ""} cursor-pointer`}
            >
              <div
                className="w-full pl-4 py-2 truncate"
                onClick={() => {
                  setSelectedCollection(collection.collectionName);
                  setSelectedCurlName(collection?.curls?.[0]?.name || "");
                  const parsed = curlConverter(
                    collection,
                    collection?.curls?.[0]?.name,
                  );
                  setSelectedCurlJson({
                    ...parsed,
                    collectionName: collection.collectionName,
                    curlName: collection?.curls?.[0]?.name || "",
                  });
                  setEnvs(collection.env);
                }}
              >
                {collection.collectionName}
              </div>
              <Menu
                name={collection.collectionName}
                type="collection"
                collectionList={collectionList}
                curlList={curlList}
                setCollections={setCollections}
                setSelectedCollection={setSelectedCollection}
                setSelectedCurlName={setSelectedCurlName}
              />
            </div>
          );
        })}
      </div>
      <div className="h-full w-[150px] pt-4 bg-cyan-100 flex flex-col gap-2 shadow-lg shadow-cyan-500/30">
        <EnvModal
          selectedEnv={envs}
          setEnvs={setEnvs}
          selectedCollection={selectedCollection}
          setCollections={setCollections}
        />
        <CreateModal
          type="route"
          collectionList={collectionList}
          curlList={curlList}
          setSelectedCollection={setSelectedCollection}
          setSelectedCurlName={setSelectedCurlName}
          selectedCollection={selectedCollection}
          setCollections={setCollections}
        />
        {selectedRouteList()?.map((curl, i) => {
          return (
            <div
              key={i}
              className={`group/menu flex items-center justify-between pr-2 rounded overflow-visible capitalize ${selectedCurlName === curl.name ? "border-r-4 border-cyan-500 bg-white" : ""} cursor-pointer`}
            >
              <div
                className="w-full pl-4 py-2 truncate"
                onClick={() => {
                  setSelectedCurlName(curl.name);
                  const coll = collections.find(
                    (c) => c.collectionName === selectedCollection,
                  );
                  const parsed = curlConverter(coll!, curl.name);
                  setSelectedCurlJson({
                    ...parsed,
                    collectionName: selectedCollection,
                    curlName: curl.name,
                  });
                  setEnvs(coll!.env);
                }}
              >
                {curl.name}
              </div>
              <Menu
                name={curl.name}
                type="route"
                collectionList={collectionList}
                curlList={curlList}
                setCollections={setCollections}
                setSelectedCollection={setSelectedCollection}
                setSelectedCurlName={setSelectedCurlName}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Menu = ({
  name,
  type,
  collectionList,
  curlList,
  setCollections,
  setSelectedCollection,
  setSelectedCurlName,
}: {
  name: string;
  type: "collection" | "route";
  collectionList: string[];
  curlList: string[];
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelectedCollection: Dispatch<SetStateAction<string>>;
  setSelectedCurlName: (value: string) => void;
}) => {
  return (
    <div className="hidden group-hover/menu:flex group/tool relative items-center justify-center overflow-visible">
      <div className="p-1 rounded-full border border-cyan-300 hover:bg-cyan-200 transition-colors cursor-pointer text-cyan-700">
        <EllipsisVertical size={18} />
      </div>
      <div className="hidden group-hover/tool:flex absolute left-0 top-0 ml-1 pl-2 z-50 animate-in fade-in zoom-in duration-200 overflow-visible">
        <div className="flex flex-col min-w-[120px] bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-lg overflow-visible">
          <RenameModal
            currentName={name}
            type={type}
            collectionList={collectionList}
            curlList={curlList}
            setCollections={setCollections}
          />

          <DeleteModal
            currentName={name}
            type={type}
            setSelectedCollection={setSelectedCollection}
            setSelectedCurlName={setSelectedCurlName}
            setCollections={setCollections}
          />
        </div>
      </div>
    </div>
  );
};
