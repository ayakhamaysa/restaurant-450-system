import { restaurant } from "../config";
import AddButton from "./AddButton";

export default function MenuItem({ item, quantity, onAdd, onRemove }) {
  return (
    <li className="flex gap-4 py-5 border-b border-ink/10 last:border-b-0">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 shrink-0 rounded-xl object-cover"
        />
      )}

      <div className="flex-1 min-w-0">
        {/* Name ..... price */}
        <div className="flex items-baseline gap-3">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <span className="font-latin italic text-sm text-ink-soft" dir="ltr">{item.nameEn}</span>
          <span className="flex-1 border-b border-dotted border-ink/30" />
          <span className="font-latin text-lg whitespace-nowrap">
            {item.price} <span className="text-sm">{restaurant.currency}</span>
          </span>
        </div>

        <div className="flex items-start gap-4 mt-1">
          <p className="flex-1 text-sm text-ink-soft leading-relaxed">{item.description}</p>

          {restaurant.ordering && (
            <AddButton quantity={quantity} onAdd={onAdd} onRemove={onRemove} />
          )}
        </div>
      </div>
    </li>
  );
}
