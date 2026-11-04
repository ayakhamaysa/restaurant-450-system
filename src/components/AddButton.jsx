// Shows "+" when the item is not in the cart,
// and "− 2 +" when it is.
export default function AddButton({ quantity, onAdd, onRemove }) {
  if (quantity === 0) {
    return (
      <button
        onClick={onAdd}
        aria-label="إضافة"
        className="w-8 h-8 shrink-0 rounded-full border border-ink/30 text-lg leading-none hover:bg-ink hover:text-paper transition"
      >
        +
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 shrink-0 bg-ink text-paper rounded-full px-1" dir="ltr">
      <button onClick={onRemove} aria-label="إنقاص" className="w-7 h-8 text-lg">−</button>
      <span className="font-latin min-w-4 text-center">{quantity}</span>
      <button onClick={onAdd} aria-label="زيادة" className="w-7 h-8 text-lg">+</button>
    </div>
  );
}
