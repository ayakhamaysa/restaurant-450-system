import { useState } from "react";
import { supabase } from "../lib/supabase";
import { restaurant } from "../config";
import { useOpenOrders } from "../hooks/useOpenOrders";
import { money, orderPlace } from "../lib/format";

const statusLabel = { new: "جديد", preparing: "بالتحضير", ready: "جاهز", delivered: "تم التسليم" };

export default function CashPage() {
  const { orders, online, reload } = useOpenOrders();
  const [confirm, setConfirm] = useState(null); // { title, total, run }

  const tableOrders = orders.filter((o) => o.order_type === "table");
  const takeaways = orders.filter((o) => o.order_type === "takeaway");
  const openTotal = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const tables = Array.from({ length: restaurant.tableCount }, (_, i) => i + 1);

  function askToSettleTable(number, list) {
    setConfirm({
      title: `طاولة ${number}`,
      total: list.reduce((sum, o) => sum + Number(o.total), 0),
      run: () => supabase.rpc("settle_table", { p_table_number: number }),
    });
  }

  function askToSettleOrder(order) {
    setConfirm({
      title: orderPlace(order),
      total: order.total,
      run: () => supabase.rpc("settle_order", { p_order_id: order.id }),
    });
  }

  async function confirmPayment() {
    await confirm.run();
    setConfirm(null);
    reload();
  }

  return (
    <main className="p-4">
      {/* Summary */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Stat label="طاولات مفتوحة" value={new Set(tableOrders.map((o) => o.table_number)).size} />
        <Stat label="طلبات سفري" value={takeaways.length} />
        <Stat label="حسابات مفتوحة" value={money(openTotal)} />
        <p className="text-sm text-ink-soft self-center">
          <span className={`inline-block w-2 h-2 rounded-full ml-2 ${online ? "bg-it-green" : "bg-it-red"}`} />
          {online ? "متصل" : "جاري الاتصال..."}
        </p>
      </div>

      {/* Tables */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 items-start">
        {tables.map((number) => {
          const list = tableOrders.filter((o) => o.table_number === number);
          const items = list.flatMap((o) => o.order_items);

          if (list.length === 0) {
            return (
              <div key={number} className="rounded-2xl border-2 border-dashed border-ink/15 p-4 text-center text-ink-soft">
                <p className="font-latin text-3xl">{number}</p>
                <p className="text-sm mt-1">فارغة</p>
              </div>
            );
          }

          return (
            <TableCard
              key={number}
              title={`طاولة ${number}`}
              orders={list}
              items={items}
              onPay={() => askToSettleTable(number, list)}
            />
          );
        })}
      </div>

      {/* Takeaway */}
      {takeaways.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-3">طلبات سفري</h2>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {takeaways.map((order) => (
              <TableCard
                key={order.id}
                title={order.customer_name}
                orders={[order]}
                items={order.order_items}
                onPay={() => askToSettleOrder(order)}
              />
            ))}
          </div>
        </>
      )}

      {/* Confirm payment */}
      {confirm && (
        <div className="fixed inset-0 z-30 bg-ink/50 flex items-center justify-center p-6">
          <div className="bg-paper w-full max-w-sm rounded-3xl p-8 text-center">
            <p className="text-ink-soft">تأكيد الدفع</p>
            <h2 className="text-2xl font-bold mt-1">{confirm.title}</h2>
            <p className="font-latin text-4xl mt-4">{money(confirm.total)}</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setConfirm(null)} className="border border-ink/20 rounded-full py-3">
                رجوع
              </button>
              <button onClick={confirmPayment} className="bg-it-green text-white rounded-full py-3 font-bold">
                تم الدفع
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function TableCard({ title, orders, items, onPay }) {
  const total = orders.reduce((sum, o) => sum + Number(o.total), 0);
  return (
    <article className="bg-paper rounded-2xl p-4 border border-ink/10 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="text-xs text-ink-soft font-latin">{orders.map((o) => `#${o.order_number}`).join(" ")}</span>
      </div>

      <ul className="mt-2 text-sm space-y-1 flex-1">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-2">
            <span>{item.quantity}× {item.product_name}</span>
            <span className="font-latin">{money(item.quantity * item.unit_price)}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-ink-soft mt-2">
        {orders.map((o) => statusLabel[o.status]).join(" · ")}
      </p>

      <div className="flex justify-between items-baseline border-t border-ink/10 mt-3 pt-3">
        <span>المجموع</span>
        <span className="font-latin text-2xl">{money(total)}</span>
      </div>

      <button onClick={onPay} className="mt-3 bg-ink text-paper rounded-full py-2.5 font-bold">
        تم الدفع
      </button>
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-paper rounded-2xl px-5 py-3">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="font-latin text-2xl">{value}</p>
    </div>
  );
}
