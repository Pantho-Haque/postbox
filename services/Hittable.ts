import { collections } from "@/constants";
import { THittableCollections } from "@/types";


export function GetHittableCollections() {
    if (typeof window === "undefined") return [];
    const storedCollections = localStorage.getItem("hittable");
    if (!storedCollections) return collections;
    return JSON.parse(storedCollections) as THittableCollections;
}

export async function GetResume() {
    const res = await fetch("https://panthohaque.vercel.app/api/resume", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });
    return res.json();
}