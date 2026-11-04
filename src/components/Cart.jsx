import { useState } from "react";
import { restaurant } from "../config";
import { supabase } from "../lib/supabase";
import AddButton from "./AddButton";

export default function Cart({ cart, onAdd, onRemove, onClear }) {
  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState("table"); // "table" or "takeaway"
  const [table, setTable] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [doneNumber, setDoneNumber] = useState(null); // order number after success

  const lines = Object.values(cart); // [{ item, quantity }, ...]
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.quantity * line.item.price, 0);
  const cur = restaurant.currency;

  async function sendOrder() {
    if (orderType === "table" && !table) return setError("اختر رقم الطاولة");
    if (orderType === "takeaway" && !name.trim()) return setError("اكتب اسمك");
    setError("");
    setSending(true);

    // The database checks the items and calculates the price itself
    const { data, error } = await supabase.rpc("submit_order", {
      p_order_type: orderType,
      p_table_number: orderType === "table" ? Number(table) : null,
      p_customer_name: name,
      p_notes: notes,
      p_items: lines.map((line) => ({ product_id: line.item.id, quantity: line.quantity })),
    });

    setSending(false);
    if (error) return setError(error.message);

    setDoneNumber(data);
    setNotes("");
    onClear();
  }

  function closeAll() {
    setOpen(false);
    setDoneNumber(null);
  }

  // Success screen
  if (doneNumber) {
    return (
      <div className="fixed inset-0 z-30 bg-ink/50 flex items-center justify-center p-6">
        <div className="bg-paper w-full max-w-sm rounded-3xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-it-green text-white text-3xl flex items-center justify-center">✓</div>
          <h2 className="text-2xl font-bold mt-5">وصل طلبك للمطبخ</h2>
          <p className="text-ink-soft mt-2">رقم الطلب</p>
          <p className="font-latin text-5xl mt-1">#{doneNumber}</p>
          <p className="font-script text-2xl mt-4" dir="ltr">Buon appetito!</p>
          <button onClick={closeAll} className="w-full mt-6 bg-ink text-paper rounded-full py-3 font-bold">
            تم
          </button>
        </div>
      </div>
    );
  }

  // Nothing in the cart: show nothing
  if (count === 0) return null;

  return (
    <>
      {/* Bar at the bottom of the screen */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 inset-x-4 z-20 max-w-md mx-auto flex items-center justify-between bg-ink text-paper rounded-full px-6 py-4 shadow-xl"
      >
        <span className="font-bold">عرض الطلب</span>
        <span>
          {count} أصناف · <span className="font-latin">{total}</span> {cur}
        </span>
      </button>

      {/* Order sheet */}
      {open && (
        <div className="fixed inset-0 z-30 bg-ink/50 flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}>
          <div
            className="bg-paper w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">طلبك</h2>
              <button onClick={() => setOpen(false)} aria-label="إغلاق" className="text-2xl">×</button>
            </div>

            {/* Items */}
            <ul className="mt-4 divide-y divide-ink/10">
              {lines.map((line) => (
                <li key={line.item.id} className="flex items-center gap-3 py-3">
                  <div className="flex-1">
                    <p className="font-bold">{line.item.name}</p>
                    <p className="font-latin text-sm text-ink-soft">
                      {line.quantity * line.item.price} {cur}
                    </p>
                  </div>
                  <AddButton
                    quantity={line.quantity}
                    onAdd={() => onAdd(line.item)}
                    onRemove={() => onRemove(line.item)}
                  />
                </li>
              ))}
            </ul>

            {/* Dine in or takeaway */}
            <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-paper-dark rounded-full">
              {[
                ["table", "داخل المطعم"],
                ["takeaway", "سفري"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setOrderType(value)}
                  className={`py-2 rounded-full transition ${orderType === value ? "bg-ink text-paper" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {orderType === "table" ? (
              <select
                value={table}
                onChange={(e) => setTable(e.target.value)}
                className="w-full mt-4 bg-white/60 border border-ink/15 rounded-xl px-4 py-3"
              >
                <option value="">رقم الطاولة</option>
                {Array.from({ length: restaurant.tableCount }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>طاولة {n}</option>
                ))}
              </select>
            ) : (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم"
                maxLength={60}
                className="w-full mt-4 bg-white/60 border border-ink/15 rounded-xl px-4 py-3"
              />
            )}

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات (مثلاً: بدون زيتون)"
              rows={2}
              maxLength={300}
              className="w-full mt-3 bg-white/60 border border-ink/15 rounded-xl px-4 py-3"
            />

            <div className="flex justify-between items-baseline mt-6 text-lg">
              <span>المجموع</span>
              <span className="font-latin text-2xl">{total} {cur}</span>
            </div>

            {error && <p className="text-it-red text-sm mt-3">{error}</p>}

            <button
              onClick={sendOrder}
              disabled={sending}
              className="w-full mt-4 bg-ink text-paper font-bold rounded-full py-4 disabled:opacity-60"
            >
              {sending ? "جاري الإرسال..." : "إرسال الطلب"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
