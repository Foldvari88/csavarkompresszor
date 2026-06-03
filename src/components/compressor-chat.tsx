"use client";

import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import type { CalculationResult, CalculatorInput } from "@/lib/calculator/types";
import { formatHuf, formatKw, formatNumber } from "@/lib/format";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

export function CompressorChat({
  calculator,
  completionPercent,
  result
}: {
  calculator: CalculatorInput;
  completionPercent: number;
  result: CalculationResult;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text:
        "Szia, én a Csavarkompresszor AI asszisztens vagyok. Kérdezz a megtakarításról, RS/VSD gépekről, üzemóráról vagy arról, mit érdemes átállítani a kalkulátorban."
    }
  ]);

  const quickPrompts = [
    "Miért ennyi a megtakarítás?",
    "RS/VSD mikor jó?",
    "Mit állítsak át először?"
  ];

  function sendMessage(text: string) {
    const cleanText = text.trim();
    if (!cleanText) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: cleanText },
      {
        role: "assistant",
        text: buildCompressorReply(cleanText, calculator, result, completionPercent)
      }
    ]);
    setDraft("");
  }

  return (
    <section className={`ai-chat ${isOpen ? "open" : ""}`} aria-label="Csavarkompresszor AI chat">
      {isOpen ? (
        <div className="ai-chat-panel">
          <div className="ai-chat-head">
            <span className="ai-avatar">
              <Bot size={19} />
            </span>
            <div>
              <strong>Csavarkompresszor AI</strong>
              <p>Élő magyarázat a kalkulációhoz</p>
            </div>
            <button
              aria-label="Chat bezárása"
              className="ai-icon-button"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="ai-context-strip">
            <span>{formatKw(calculator.nominalKw)}</span>
            <span>{formatNumber(calculator.annualHours)} óra/év</span>
            <span>{formatHuf(result.annualHufSaved)} / év</span>
          </div>

          <div className="ai-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`ai-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </div>
            ))}
          </div>

          <div className="ai-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="ai-chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(draft);
            }}
          >
            <input
              aria-label="Kérdés a Csavarkompresszor AI asszisztensnek"
              placeholder="Kérdezz a csavarkompresszor cseréről..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button aria-label="Küldés" type="submit">
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : null}

      <button
        className="ai-chat-launcher"
        aria-label="Csavarkompresszor AI megnyitása"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          <MessageCircle size={20} />
        </span>
      </button>
    </section>
  );
}

function buildCompressorReply(
  question: string,
  calculator: CalculatorInput,
  result: CalculationResult,
  completionPercent: number
) {
  const normalized = question.toLowerCase();
  const currentSummary = `${formatKw(calculator.nominalKw)} gépnél, ${formatNumber(
    calculator.annualHours
  )} óra/év üzemmel most kb. ${formatHuf(result.annualHufSaved)} éves megtakarítás látszik.`;

  if (normalized.includes("rs") || normalized.includes("vsd") || normalized.includes("fordulat")) {
    return `${currentSummary} Az RS/VSD akkor különösen erős, ha a levegőigény nem állandó: a gép nem teljes terhelésen fut végig, hanem követi a fogyasztást. Ha több műszak, változó termelés vagy gyakori részterhelés van, érdemes bekapcsolva hagyni az RS opciót.`;
  }

  if (
    normalized.includes("megtakar") ||
    normalized.includes("forint") ||
    normalized.includes("kwh") ||
    normalized.includes("energia")
  ) {
    return `${currentSummary} A számítás lényege a régi becsült felvett teljesítmény és az ajánlott korszerű gép felvett teljesítményének különbsége. Ennél a beállításnál ez ${formatNumber(
      result.annualKwhSaved
    )} kWh/év különbséget ad.`;
  }

  if (normalized.includes("üzem") || normalized.includes("óra") || normalized.includes("áram")) {
    return `${currentSummary} A két legerősebb mező általában az éves üzemóra és az áramár. Ha a kompresszor sokat fut, már kis kW különbség is nagy éves forintértéket ad. Próbáld ki a valós termelési órát és a legutóbbi villanyszámla szerinti Ft/kWh értéket.`;
  }

  if (normalized.includes("kor") || normalized.includes("régi") || normalized.includes("elhasznál")) {
    return `${currentSummary} Idősebb gépnél a kalkulátor nagyobb veszteségi kockázattal számol. A gyakorlatban ezt szivárgás, kopás, nem optimális szabályzás és rosszabb részterhelési viselkedés is erősítheti.`;
  }

  if (normalized.includes("modell") || normalized.includes("ajánlott") || normalized.includes("gép")) {
    return `${currentSummary} A jelenlegi ajánlott gép: ${formatModelName(
      result.recommendedModel
    )}. A logika először az azonos névleges kW-t keresi, ha nincs pontos találat, akkor a következő nagyobb korszerű modellt veszi figyelembe.`;
  }

  if (normalized.includes("riport") || normalized.includes("email") || normalized.includes("küld")) {
    return `A képernyőn csak előnézetet látsz. A részletes email riportban benne lesznek a megadott adatok, a feltételezések, az éves kWh/Ft megtakarítás és az ajánlott gép. A kitöltési állapot most ${completionPercent}%.`;
  }

  return `${currentSummary} Jó következő lépés: ellenőrizd a névleges kW-t, az éves üzemórát és az áramárat. Ezek mozgatják legjobban a kalkulációt. Ha konkrét termelési profilt írsz, segítek értelmezni, melyik mezőn érdemes finomítani.`;
}

function formatModelName(model: CalculationResult["recommendedModel"]) {
  return `${model.brand} ${model.model}`;
}
