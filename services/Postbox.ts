import { collections } from "@/constants";
import { TPostBoxCollections } from "@/types";



export function GetPostboxCollections() {
    "use client";
    // return collections;
    const storedCollections = localStorage.getItem("postbox");
    if (!storedCollections) return collections;
    return JSON.parse(storedCollections) as TPostBoxCollections;
}