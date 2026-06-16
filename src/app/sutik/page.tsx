import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Süti tájékoztató | iparikalkulator.hu",
  description: "Az iparikalkulator.hu süti tájékoztatója."
};

export default function CookiesPage() {
  return (
    <LegalPage
      variant="industrial"
      eyebrow="Süti kezelés"
      title="Süti tájékoztató"
      lead="A weboldalon használt sütik és hasonló technológiák kötelező tájékoztatója."
      highlights={[
        { value: "Mindig aktív", label: "szükséges sütik" },
        { value: "Hozzájárulás", label: "analitika" },
        { value: "Hozzájárulás", label: "kampánymérés" }
      ]}
      sections={[
        {
          title: "Szükséges sütik",
          items: [
            "A szükséges sütik a weboldal alapvető működéséhez, biztonságához, űrlapkezeléséhez és a süti beállítások mentéséhez szükségesek.",
            "Ezek nélkül a weboldal egyes funkciói nem működnének megfelelően.",
            "Jogalap: a weboldal működtetéséhez fűződő jogos érdek, illetve a felhasználó által kért online szolgáltatás biztosítása."
          ]
        },
        {
          title: "Analitikai sütik",
          items: [
            "Analitikai sütik csak a látogató előzetes hozzájárulása esetén használhatók.",
            "Céljuk a weboldal látogatottságának, használatának és technikai teljesítményének mérése.",
            "Használt analitikai szolgáltatások: [kitöltendő, ha van ilyen]."
          ]
        },
        {
          title: "Kampánymérési sütik",
          items: [
            "Kampánymérési vagy hirdetési sütik csak a látogató előzetes hozzájárulása esetén használhatók.",
            "Céljuk annak mérése, hogy a látogató milyen hivatkozásból, kampányból vagy hirdetési csatornából érkezett.",
            "Használt kampánymérési vagy hirdetési szolgáltatások: [kitöltendő, ha van ilyen]."
          ]
        },
        {
          title: "Beállítás és visszavonás",
          items: [
            "A nem szükséges sütik a süti panelen engedélyezhetők vagy elutasíthatók.",
            "A hozzájárulás a böngészőben tárolt süti beállítás törlésével vagy a böngésző süti beállításain keresztül módosítható.",
            "A böngészőben a sütik bármikor törölhetők vagy blokkolhatók."
          ]
        }
      ]}
    />
  );
}
