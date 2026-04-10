export * from "./notification";
export * from "./postbox";
export * from "./note";

export type TApiResponse<T> = {
  data?: T;
  message: string;
  ok: boolean;
  status: number;
};