export const siteUrl = "https://iparikalkulator.hu";

export const siteName = "iparikalkulator.hu";

export const defaultDescription =
  "Ipari csavarkompresszor megtakarítás kalkulátor éves energiafogyasztás, kWh-különbség és becsült villamosenergia-költség számításához.";

export const coreSeoRoutes = [
  {
    path: "/",
    priority: 1,
    changeFrequency: "weekly" as const
  },
  {
    path: "/csavarkompresszor-megtakaritas-kalkulator",
    priority: 0.9,
    changeFrequency: "monthly" as const
  },
  {
    path: "/csavarkompresszor-csere-megterules",
    priority: 0.86,
    changeFrequency: "monthly" as const
  },
  {
    path: "/rs-vsd-csavarkompresszor",
    priority: 0.82,
    changeFrequency: "monthly" as const
  },
  {
    path: "/kompresszor-aramfogyasztas-kalkulator",
    priority: 0.88,
    changeFrequency: "monthly" as const
  },
  {
    path: "/suritett-levego-energiaaudit",
    priority: 0.78,
    changeFrequency: "monthly" as const
  },
  {
    path: "/ipari-kompresszor-energia-megtakaritas",
    priority: 0.78,
    changeFrequency: "monthly" as const
  }
];

export const legalRoutes = [
  "/adatkezeles",
  "/aszf",
  "/impresszum",
  "/sutik"
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
