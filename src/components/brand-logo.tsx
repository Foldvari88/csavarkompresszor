import "./brand-logo.css";

export function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      aria-label="iparikalkulator.hu"
      className={`brand-logo${inverse ? " brand-logo--inverse" : ""}`}
      role="img"
    >
      <svg aria-hidden="true" className="brand-logo-symbol" focusable="false" viewBox="0 0 48 48">
        <rect x=".5" y=".5" width="47" height="47" rx="11" fill="#18233b" stroke="#36435b" />
        <path d="M11 12h4v24h-4z" fill="#d5b47b" />
        <path d="M22 12h4v24h-4zm13 0h5L29 24l11 12h-5L24 24z" fill="#f5f7fc" />
      </svg>
      <span className="brand-logo-type">
        <span className="brand-logo-wordmark">
          <span className="brand-logo-prefix">ipari</span>kalkulator<span className="brand-logo-domain">.hu</span>
        </span>
        <span className="brand-logo-caption">Ipari energiahatékonyság</span>
      </span>
    </span>
  );
}
