// import { collections } from "@/constants";
import { TPostBoxCollections } from "@/types";



export function GetPostboxCollections() {
    "use client";
    // return collections;
    return JSON.parse(localStorage.getItem("postbox") || "[]") as TPostBoxCollections;
}