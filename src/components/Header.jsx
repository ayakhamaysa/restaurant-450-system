import { restaurant } from "../config";
import OliveBranch from "./OliveBranch";

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-paper text-ink text-center px-6 pt-14 pb-10">
      {/* Dark wave on the side, like the paper menu */}
      <svg
        viewBox="0 0 100 400"
        preserveAspectRatio="none"
        className="absolute inset-y-0 left-0 h-full w-14 sm:w-40 text-ink"
      >
        <path d="M0 0 H100 C 40 120, 90 260, 30 400 H0 Z" fill="currentColor" />
        <path d="M0 0 H70 C 20 130, 70 260, 10 400 H0 Z" fill="#3a4030" />
      </svg>

      {/* Logo, built like the original: branch, PIZZERIA, 450•, NAPOLETANA */}
      <div className="relative" dir="ltr">
        <OliveBranch className="w-36 mx-auto text-ink/80" />

        <p className="font-latin text-sm tracking-[0.5em] mt-2">{restaurant.label}</p>

        <h1 className="font-latin text-8xl sm:text-9xl leading-none mt-1 inline-flex items-start">
          {restaurant.name}
          {/* The degree sign as a solid dot, like the logo */}
          <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-ink mt-3 ml-1" />
        </h1>

        <p className="font-latin text-sm tracking-[0.5em] mt-2">{restaurant.subtitle}</p>

        <p className="font-latin text-[11px] tracking-[0.3em] text-ink-soft mt-3">
          {restaurant.services.join("  ·  ").toUpperCase()}
        </p>
      </div>

      <div className="relative">
        <p className="font-script text-3xl text-ink/80 mt-8" dir="ltr">{restaurant.script}</p>
        <p className="text-lg mt-2">{restaurant.tagline}</p>
      </div>

      {/* Oven: under the text on phones, on the side on big screens */}
      <img
        src="/oven.webp"
        width="640"
        height="489"
        fetchPriority="high"
        alt=""
        className="relative block w-60 mx-auto mt-8 md:absolute md:w-80 md:mt-0 md:right-[4%] md:bottom-6 pointer-events-none"
      />
    </header>
  );
}
