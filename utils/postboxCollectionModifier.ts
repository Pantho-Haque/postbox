import { TPostBoxCollections } from "@/types";

export const createCollectionName = (
  prev: TPostBoxCollections,
  currentName: string,
) => {
  return [...prev, { collectionName: currentName, curls: [], env: {} }];
};

export const createCurlName = (
  prev: TPostBoxCollections,
  selectedCollection: string,
  currentName: string,
) => {
  return prev.map((collection) => {
    if (collection.collectionName === selectedCollection) {
      return {
        ...collection,
        curls: [...collection.curls, { name: currentName, curl: "", response: "" }],
      };
    }
    return collection;
  });
};

export const renameCollectionName = (
  prev: TPostBoxCollections,
  currentName: string,
  newName: string,
) => {
  return prev.map((collection) => {
    if (collection.collectionName === currentName) {
      return {
        ...collection,
        collectionName: newName,
      };
    }
    return collection;
  });
};

export const renameCurlName = (
  prev: TPostBoxCollections,
  currentName: string,
  collectionName: string,
  newName: string,
) => {
  return prev.map((collection) => {
    if (collection.collectionName == collectionName) {
      return {
        ...collection,
        curls: collection.curls.map((curl) =>
          curl.name === currentName ? { ...curl, name: newName } : curl,
        ),
      };
    } else return collection;
  });
};

export const isAlreadyExists = (
  collectionCurlList: { [key: string]: string[] },
  type: string,
  value: string,
  collectionName?: string,
) => {
  if (type === "collection") {
    return Object.keys(collectionCurlList).includes(value.trim());
  } else if (collectionCurlList && !!collectionName) {
    return collectionCurlList[collectionName].includes(value.trim());
  }
};

export const updateCurl = (
  prev: TPostBoxCollections,
  collectionName: string,
  curlName: string,
  curl: string,
  response:string,
) => {
  return prev.map((collection) => {
    if (collection.collectionName === collectionName) {
      return {
        ...collection,
        curls: collection.curls.map((c) =>
          c.name === curlName ? { ...c, curl,response} : c,
        ),

      };
    }
    return collection;
  });
};

export const deleteCollectionName = (
  prev: TPostBoxCollections,
  currentName: string,
) => {
  return prev.filter((collection) => collection.collectionName !== currentName);
};

export const deleteCurlName = (
  prev: TPostBoxCollections,
  collectionName: string,
  currentName: string,
) => {
  return prev.map((collection) => {
    if (collection.collectionName == collectionName) {
      return {
        ...collection,
        curls: collection.curls.filter((curl) => curl.name !== currentName),
      };
    }else return collection;
  });
};

export const updateEnv = (
  prev: TPostBoxCollections,
  collectionName: string,
  env: Record<string, string>,
) => {
  return prev.map((collection) => {
    if (collection.collectionName === collectionName) {
      return {
        ...collection,
        env,
      };
    }
    return collection;
  });
};
