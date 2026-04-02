export type TabSize = 2 | 4 | "tab";

export type TPostBoxEnv = {
  [key: string]: string;
};

export type TPostBoxCurl = {
  name: string;
  curl: string;
  response: string;
};

export type TPostBoxCollection = {
  collectionName: string;
  curls: TPostBoxCurl[];
  env: TPostBoxEnv;
};

export type TPostBoxCollections = TPostBoxCollection[];

export type TPostBoxCurlJson = {
  method: string;
  url: string;
  headers: string;
  body: string;
};

export type TPostBoxSelectorSelection = {
    collectionName: string;
    curlName: string;
}

export type TResponseJson = {
    data?: unknown;
    status?: number;
    statusText?: string;
    ok?: boolean;
    headers?: unknown;
    error?: string;
} | null;

export type TPostBoxSelectorResponse = {
    collectionName: string;
    curlName: string;
    env?: TPostBoxEnv;
    curlJson: TPostBoxCurlJson;
    responseJson?: TResponseJson;
};
