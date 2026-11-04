// Thin line in the colors of the Italian flag
export default function ItalyLine({ className = "" }) {
  return (
    <div className={`flex h-[3px] ${className}`} dir="ltr">
      <span className="flex-1 bg-it-green" />
      <span className="flex-1 bg-it-white" />
      <span className="flex-1 bg-it-red" />
    </div>
  );
}
