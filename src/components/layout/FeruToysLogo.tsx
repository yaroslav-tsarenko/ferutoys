/**
 * FeruToys wordmark — a high-contrast didone lockup with a small brushed-brass
 * "spark" glyph (a soft four-point ember). Tasteful, sensual and confident —
 * never explicit. Reads as a boutique intimacy house.
 */
export function FeruToysLogo({
  size = 24,
  tone = "dark",
}: {
  size?: number;
  tone?: "dark" | "light";
}) {
  const textColor =
    tone === "light" ? "text-[#F6ECEC]" : "text-[color:var(--color-text)]";
  const spark = Math.max(16, Math.round(size * 0.92));

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap leading-none">
      {/* Brushed-brass spark — the tasteful "ember" mark */}
      <svg
        aria-hidden
        width={spark}
        height={spark}
        viewBox="0 0 24 24"
        fill="none"
        style={{ filter: "drop-shadow(0 0 5px rgba(208,168,95,0.55))" }}
      >
        <defs>
          <radialGradient id="ft-spark" cx="50%" cy="44%" r="62%">
            <stop offset="0%" stopColor="#F0D9A0" />
            <stop offset="52%" stopColor="#D0A85F" />
            <stop offset="100%" stopColor="#B4863F" />
          </radialGradient>
        </defs>
        <path
          d="M12 1.4C12.55 7.1 13.2 8.9 14.7 9.6C16.2 10.3 18 10.95 22.6 12C18 13.05 16.2 13.7 14.7 14.4C13.2 15.1 12.55 16.9 12 22.6C11.45 16.9 10.8 15.1 9.3 14.4C7.8 13.7 6 13.05 1.4 12C6 10.95 7.8 10.3 9.3 9.6C10.8 8.9 11.45 7.1 12 1.4Z"
          fill="url(#ft-spark)"
        />
      </svg>
      <span
        className={`font-brand font-normal ${textColor}`}
        style={{
          // Shrinks on narrow screens so the wordmark never wraps to two lines.
          fontSize: `clamp(${Math.round(size * 0.66)}px, 4.4vw, ${size}px)`,
          letterSpacing: "0.06em",
        }}
      >
        FERU
        <span style={{ color: "#D0A85F" }}>TOYS</span>
      </span>
    </span>
  );
}

export const FeruToysMark = FeruToysLogo;
