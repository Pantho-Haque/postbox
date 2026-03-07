import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import { CreateModal, DeleteModal, EnvModal, RenameModal } from "@/components";
import { curlConverter } from "@/utils/curlConverter";
import {
  TPostBoxCollections,
  TPostBoxSelectorResponse,
  TPostBoxSelectorSelection,
} from "@/types";

export default function Selector({
  collections,
  setCollections,
  setSelectorResponse,
}: {
  collections: TPostBoxCollections;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelectorResponse: Dispatch<
    SetStateAction<TPostBoxSelectorResponse | null>
  >;
}) {
  const collectionCurlList = collections.reduce(
    (acc, c) => {
      acc[c.collectionName] = c.curls.map((curl) => curl.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const [selection, setSelection] = useState<TPostBoxSelectorSelection>({
    collectionName: "",
    curlName: "",
  });

  useEffect(() => {
    if (!!selection.curlName) {
      setSelectorResponse({
        collectionName: selection.collectionName,
        curlName: selection.curlName,
        env: collections.find(
          (c) => c.collectionName === selection.collectionName,
        )?.env,
        curlJson: curlConverter(
          collections
            .find((c) => c.collectionName === selection.collectionName)
            ?.curls.find((c) => c.name === selection.curlName)?.curl || "",
        ),
      });
    } else {
      setSelectorResponse(null);
    }
  }, [selection, collections, setSelectorResponse]);

  return (
    <div className="h-full w-[300px] flex z-1">
      <div className="h-full w-[150px] pt-4 bg-gray-50  flex flex-col gap-2">
        <CreateModal
          type="collection"
          selection={selection}
          setSelection={setSelection}
          setCollections={setCollections}
          setSelectorResponse={setSelectorResponse}
          collectionCurlList={collectionCurlList}
        />
        {Object.entries(collectionCurlList)?.map(
          ([collectionName, curlList], i) => {
            return (
              <div
                key={i}
                className={`group/menu flex items-center justify-between pr-2 rounded overflow-visible capitalize font-semibold ${selection.collectionName === collectionName ? "border-b-4 border-cyan-500 bg-cyan-100" : ""} cursor-pointer`}
              >
                <div
                  className="w-full pl-4 py-2 truncate"
                  onClick={() => {
                    setSelection({
                      collectionName,
                      curlName: curlList[0],
                    });
                  }}
                >
                  {collectionName}
                </div>
                <Menu
                  type="collection"
                  collectionCurlList={collectionCurlList}
                  currentName={collectionName}
                  setCollections={setCollections}
                  setSelection={setSelection}
                />
              </div>
            );
          },
        )}
      </div>
      {selection.collectionName && (
        <div className="h-full w-[150px] pt-4 bg-cyan-100 flex flex-col gap-2 shadow-lg shadow-cyan-500/30">
          <EnvModal
            envs={
              collections.filter(
                (el) => el.collectionName == selection.collectionName,
              )[0]?.env
            }
            collectionName={selection.collectionName}
            setCollections={setCollections}
            setSelectorResponse={setSelectorResponse}
          />
          <CreateModal
            type="route"
            selection={selection}
            setSelection={setSelection}
            setCollections={setCollections}
            setSelectorResponse={setSelectorResponse}
            collectionCurlList={collectionCurlList}
          />
          {collectionCurlList[selection.collectionName]?.map((curl, i) => {
            return (
              <div
                key={i}
                className={`group/menu flex items-center justify-between pr-2 rounded overflow-visible capitalize ${selection.curlName === curl ? "border-r-4 border-cyan-500 bg-white" : ""} cursor-pointer`}
              >
                <div
                  className="w-full pl-4 py-2 truncate"
                  onClick={() => {
                    setSelection({
                      ...selection,
                      curlName: curl,
                    });
                  }}
                >
                  {curl}
                </div>
                <Menu
                  type="route"
                  collectionCurlList={collectionCurlList}
                  currentName={curl}
                  collectionName={selection.collectionName}
                  setCollections={setCollections}
                  setSelection={setSelection}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Menu = ({
  type,
  collectionCurlList,
  currentName,
  collectionName,
  setCollections,
  setSelection,
}: {
  type: "collection" | "route";
  collectionCurlList: { [key: string]: string[] };
  currentName: string;
  collectionName?: string;
  setCollections: Dispatch<SetStateAction<TPostBoxCollections>>;
  setSelection: Dispatch<SetStateAction<TPostBoxSelectorSelection>>;
}) => {
  return (
    <div className="hidden group-hover/menu:flex group/tool relative items-center justify-center overflow-visible">
      <div className="p-1 rounded-full border border-cyan-300 hover:bg-cyan-200 transition-colors cursor-pointer text-cyan-700">
        <EllipsisVertical size={18} />
      </div>
      <div className="hidden group-hover/tool:flex absolute left-0 top-0 ml-1 pl-2 z-50 animate-in fade-in zoom-in duration-200 overflow-visible">
        <div className="flex flex-col min-w-[120px] bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-lg overflow-visible">
          <RenameModal
            currentName={currentName}
            type={type}
            collectionCurlList={collectionCurlList}
            collectionName={collectionName}
            setCollections={setCollections}
            setSelection={setSelection}
          />

          <DeleteModal
            currentName={currentName}
            type={type}
            collectionName={collectionName}
            setCollections={setCollections}
            setSelection={setSelection}
          />
        </div>
      </div>
    </div>
  );
};
