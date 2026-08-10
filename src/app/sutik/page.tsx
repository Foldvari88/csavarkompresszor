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
      lead="A weboldalon használt sütik és hasonló technológiák tájékoztatója."
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
            "Használt analitikai szolgáltatás: Google Analytics.",
            "A Google Analytics címkék kezelése Google Tag Manageren keresztül történhet."
          ]
        },
        {
          title: "Kampánymérési adatok",
          items: [
            "Kampánymérési vagy hirdetési sütik csak a látogató előzetes hozzájárulása esetén használhatók.",
            "A weboldal a lead beküldésekor rögzítheti az URL-ben érkező kampányparamétereket, például UTM, gclid, gbraid, wbraid vagy li_fat_id paramétert.",
            "Használt kampánymérési és hirdetési szolgáltatások: Google Ads conversion tracking, Google Ads remarketing és Meta Pixel.",
            "A hirdetési és remarketing címkék kezelése Google Tag Manageren keresztül történhet."
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
