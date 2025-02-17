import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const voiceModels = [
  {
    label: "Asteria",
    value: "aura-asteria-en",
  },
  {
    label: "Luna",
    value: "aura-luna-en",
  },
  {
    label: "Stella",
    value: "aura-stella-en",
  },
  {
    label: "Athena",
    value: "aura-athena-en",
  },
  {
    label: "Hera",
    value: "aura-hera-en",
  },
  {
    label: "Orion",
    value: "aura-orion-en",
  },
  {
    label: "Arcas",
    value: "aura-arcas-en",
  },
  {
    label: "Perseus",
    value: "aura-perseus-en",
  },
  {
    label: "Angus",
    value: "aura-angus-en",
  },
  {
    label: "Orpheus",
    value: "aura-orpheus-en",
  },
  {
    label: "Helios",
    value: "aura-helios-en",
  },
  {
    label: "Zeus",
    value: "aura-zeus-en",
  },
];
