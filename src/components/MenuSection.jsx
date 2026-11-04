import { restaurant } from "../config";
import MenuItem from "./MenuItem";
import AddButton from "./AddButton";

export default function MenuSection({ category, cart, onAdd, onRemove }) {
  // How many of this item are in the cart (0 if none)
  const quantityOf = (item) => cart[item.id]?.quantity || 0;

  return (
    <section id={category.id} className="scroll-mt-20 pt-14">
      {/* Title like the paper menu: English big, Arabic under it */}
      <div className="flex items-end justify-between border-b-2 border-ink pb-2">
        <h2 className="text-2xl font-bold">{category.titleAr}</h2>
        <p className="font-latin text-2xl tracking-[0.25em] uppercase" dir="ltr">
          {category.title}
        </p>
      </div>

      {category.compact ? (
        // Short list for drinks: name and price only
        <ul className="grid sm:grid-cols-2 gap-x-10 mt-4">
          {category.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2">
              <span className="font-medium">{item.name}</span>
              <span className="flex-1 border-b border-dotted border-ink/30" />
              <span className="font-latin">{item.price} {restaurant.currency}</span>
              {restaurant.ordering && (
                <AddButton
                  quantity={quantityOf(item)}
                  onAdd={() => onAdd(item)}
                  onRemove={() => onRemove(item)}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-2">
          {category.items.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              quantity={quantityOf(item)}
              onAdd={() => onAdd(item)}
              onRemove={() => onRemove(item)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
