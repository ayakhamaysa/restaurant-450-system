import ItalyLine from "./ItalyLine";

export default function CategoryNav({ categories }) {
  return (
    <nav className="sticky top-0 z-10 bg-paper/90 backdrop-blur">
      <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto px-4 py-3">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="shrink-0 px-4 py-1.5 rounded-full border border-ink/15 text-sm hover:bg-ink hover:text-paper transition"
          >
            {category.titleAr}
          </a>
        ))}
      </div>

      {/* Flag line under the categories */}
      <ItalyLine />
    </nav>
  );
}
