import { collections } from "@/constants";
import { THittableCollections } from "@/types";


export function GetHittableCollections() {
    if (typeof window === "undefined") return [];
    const storedCollections = localStorage.getItem("hittable");
    if (!storedCollections) return collections;
    return JSON.parse(storedCollections) as THittableCollections;
}

