// Generated from Kompresszor energiahatékonyság számoló.xlsx. Do not edit values by hand.
import type { CompressorModel, LegacyPerformanceRow } from "./types";

export const ASSUMPTION_VERSION = {
  id: "excel-v1-2026-06-02",
  source: "Kompresszor energiahatékonyság számoló.xlsx",
  defaultAnnualHours: 5500,
  defaultEnergyPriceHufKwh: 35,
  ageDegradationStep: 0.05,
  rsInputPowerFactor: 0.7
} as const;

export const LEGACY_BRANDS = [
  "ABAC",
  "Almig",
  "Alup",
  "Atlas Copco",
  "Boge",
  "Ceccato",
  "CompAir",
  "Egyéb",
  "FIAC",
  "Hertz",
  "Ingersoll Rand",
  "Kaeser",
  "Mark",
  "Renner",
  "Worthington"
] as const;

export const LEGACY_CATEGORIES = [
  "Közép",
  "Prémium"
] as const;

export const NOMINAL_KW_VALUES = [
  5.5,
  7.5,
  11.0,
  15.0,
  18.5,
  22.0,
  30.0,
  37.0,
  45.0,
  55.0,
  75.0,
  90.0,
  110.0,
  132.0,
  160.0,
  200.0,
  250.0
] as const;

export const COMPAIR_MODELS: CompressorModel[] = [
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L05",
    "nominalKw": 5.5,
    "inputKw": 5.25,
    "priceEur": 4115.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L07E",
    "nominalKw": 7.5,
    "inputKw": 7.76,
    "priceEur": 5649.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L11E",
    "nominalKw": 11.0,
    "inputKw": 11.79,
    "priceEur": 6409.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L15",
    "nominalKw": 15.0,
    "inputKw": 15.53,
    "priceEur": 7280.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L18",
    "nominalKw": 18.5,
    "inputKw": 18.85,
    "priceEur": 7605.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L22",
    "nominalKw": 22.0,
    "inputKw": 21.94,
    "priceEur": 7865.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L30",
    "nominalKw": 30.0,
    "inputKw": 31.81,
    "priceEur": 16140.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L37",
    "nominalKw": 37.0,
    "inputKw": 39.42,
    "priceEur": 17760.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L45",
    "nominalKw": 45.0,
    "inputKw": 45.64,
    "priceEur": 19260.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L55",
    "nominalKw": 55.0,
    "inputKw": 57.13,
    "priceEur": 23980.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L75",
    "nominalKw": 75.0,
    "inputKw": 77.41,
    "priceEur": 26345.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L90",
    "nominalKw": 90.0,
    "inputKw": 90.1,
    "priceEur": 37180.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L110",
    "nominalKw": 110.0,
    "inputKw": 111.09,
    "priceEur": 41745.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L132",
    "nominalKw": 132.0,
    "inputKw": 129.96,
    "priceEur": 46255.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L160FC",
    "nominalKw": 160.0,
    "inputKw": 160.16,
    "priceEur": 77000.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L200FC",
    "nominalKw": 200.0,
    "inputKw": 199.04,
    "priceEur": 83600.0
  },
  {
    "brand": "CompAir",
    "kind": "fixed",
    "series": "Fix fordulatszámú - Olajkenésű csavarkompresszor",
    "model": "L250FC",
    "nominalKw": 250.0,
    "inputKw": 217.57,
    "priceEur": 91850.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L07RS",
    "nominalKw": 7.5,
    "inputKw": 5.432,
    "priceEur": 7995.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L11RS",
    "nominalKw": 11.0,
    "inputKw": 8.253,
    "priceEur": 8645.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L15RS",
    "nominalKw": 15.0,
    "inputKw": 10.871,
    "priceEur": 9685.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L18RS",
    "nominalKw": 18.5,
    "inputKw": 13.195,
    "priceEur": 10270.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L22RS",
    "nominalKw": 22.0,
    "inputKw": 15.358,
    "priceEur": 10725.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L30RS",
    "nominalKw": 30.0,
    "inputKw": 22.267,
    "priceEur": 21420.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L37RS",
    "nominalKw": 37.0,
    "inputKw": 27.594,
    "priceEur": 23580.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L45RS",
    "nominalKw": 45.0,
    "inputKw": 31.948,
    "priceEur": 25620.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L55RS",
    "nominalKw": 55.0,
    "inputKw": 39.991,
    "priceEur": 32175.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L75RS",
    "nominalKw": 75.0,
    "inputKw": 54.187,
    "priceEur": 34265.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L90RS",
    "nominalKw": 90.0,
    "inputKw": 63.07,
    "priceEur": 52085.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L110FCRS",
    "nominalKw": 110.0,
    "inputKw": 77.763,
    "priceEur": 58850.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L132FCRS",
    "nominalKw": 132.0,
    "inputKw": 90.972,
    "priceEur": 64900.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L160FCRS",
    "nominalKw": 160.0,
    "inputKw": 112.112,
    "priceEur": 111100.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L200FCRS",
    "nominalKw": 200.0,
    "inputKw": 139.328,
    "priceEur": 119900.0
  },
  {
    "brand": "CompAir",
    "kind": "rs",
    "series": "Fordulatszám szabályzós - Olajkenésű csavarkompresszor",
    "model": "L250FCRS",
    "nominalKw": 250.0,
    "inputKw": 152.299,
    "priceEur": 136400.0
  }
];

export const LEGACY_PERFORMANCE_ROWS: LegacyPerformanceRow[] = [
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 5.5,
    "inputKwBase": 6.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 7.5,
    "inputKwBase": 8.5
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 11.0,
    "inputKwBase": 13.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 15.0,
    "inputKwBase": 18.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 18.5,
    "inputKwBase": 22.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 22.0,
    "inputKwBase": 26.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 30.0,
    "inputKwBase": 36.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 37.0,
    "inputKwBase": 43.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 45.0,
    "inputKwBase": 53.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 55.0,
    "inputKwBase": 64.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 75.0,
    "inputKwBase": 82.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 90.0,
    "inputKwBase": 98.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 110.0,
    "inputKwBase": 122.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 132.0,
    "inputKwBase": 145.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 160.0,
    "inputKwBase": 175.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 200.0,
    "inputKwBase": 220.0
  },
  {
    "category": "Prémium",
    "brand": "CompAir",
    "nominalKw": 250.0,
    "inputKwBase": 260.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 5.5,
    "inputKwBase": 6.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 7.5,
    "inputKwBase": 8.5
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 11.0,
    "inputKwBase": 13.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 15.0,
    "inputKwBase": 18.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 18.5,
    "inputKwBase": 22.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 22.0,
    "inputKwBase": 26.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 30.0,
    "inputKwBase": 36.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 37.0,
    "inputKwBase": 43.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 45.0,
    "inputKwBase": 53.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 55.0,
    "inputKwBase": 64.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 75.0,
    "inputKwBase": 82.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 90.0,
    "inputKwBase": 98.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 110.0,
    "inputKwBase": 122.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 132.0,
    "inputKwBase": 145.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 160.0,
    "inputKwBase": 175.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 200.0,
    "inputKwBase": 220.0
  },
  {
    "category": "Prémium",
    "brand": "Atlas Copco",
    "nominalKw": 250.0,
    "inputKwBase": 260.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 5.5,
    "inputKwBase": 6.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 7.5,
    "inputKwBase": 8.5
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 11.0,
    "inputKwBase": 13.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 15.0,
    "inputKwBase": 18.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 18.5,
    "inputKwBase": 22.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 22.0,
    "inputKwBase": 26.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 30.0,
    "inputKwBase": 36.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 37.0,
    "inputKwBase": 43.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 45.0,
    "inputKwBase": 53.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 55.0,
    "inputKwBase": 64.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 75.0,
    "inputKwBase": 82.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 90.0,
    "inputKwBase": 98.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 110.0,
    "inputKwBase": 122.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 132.0,
    "inputKwBase": 145.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 160.0,
    "inputKwBase": 175.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 200.0,
    "inputKwBase": 220.0
  },
  {
    "category": "Prémium",
    "brand": "Kaeser",
    "nominalKw": 250.0,
    "inputKwBase": 260.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 5.5,
    "inputKwBase": 6.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 7.5,
    "inputKwBase": 8.5
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 11.0,
    "inputKwBase": 13.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 15.0,
    "inputKwBase": 18.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 18.5,
    "inputKwBase": 22.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 22.0,
    "inputKwBase": 26.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 30.0,
    "inputKwBase": 36.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 37.0,
    "inputKwBase": 43.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 45.0,
    "inputKwBase": 53.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 55.0,
    "inputKwBase": 64.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 75.0,
    "inputKwBase": 82.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 90.0,
    "inputKwBase": 98.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 110.0,
    "inputKwBase": 122.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 132.0,
    "inputKwBase": 145.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 160.0,
    "inputKwBase": 175.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 200.0,
    "inputKwBase": 220.0
  },
  {
    "category": "Prémium",
    "brand": "Ingersoll Rand",
    "nominalKw": 250.0,
    "inputKwBase": 260.0
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "Boge",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "Alup",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "Almig",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "Ceccato",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "Worthington",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "Renner",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "FIAC",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "Hertz",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "ABAC",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "Mark",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 5.5,
    "inputKwBase": 6.18
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 7.5,
    "inputKwBase": 8.755
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 11.0,
    "inputKwBase": 13.39
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 15.0,
    "inputKwBase": 18.54
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 18.5,
    "inputKwBase": 22.66
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 22.0,
    "inputKwBase": 26.78
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 30.0,
    "inputKwBase": 37.08
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 37.0,
    "inputKwBase": 44.29
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 45.0,
    "inputKwBase": 54.59
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 55.0,
    "inputKwBase": 65.92
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 75.0,
    "inputKwBase": 84.46
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 90.0,
    "inputKwBase": 100.94
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 110.0,
    "inputKwBase": 125.66
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 132.0,
    "inputKwBase": 149.35
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 160.0,
    "inputKwBase": 180.25
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 200.0,
    "inputKwBase": 226.6
  },
  {
    "category": "Közép",
    "brand": "Egyéb",
    "nominalKw": 250.0,
    "inputKwBase": 267.8
  }
];
