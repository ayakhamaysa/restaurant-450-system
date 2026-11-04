import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useOpenOrders } from "../hooks/useOpenOrders";
import { timeAgo, orderPlace } from "../lib/format";

// The three columns of the kitchen
const lanes = [
  { status: "new", title: "طلبات جديدة", next: "preparing", action: "بدء التحضير", color: "bg-it-red" },
  { status: "preparing", title: "قيد التحضير", next: "ready", action: "جاهز", color: "bg-ember" },
  { status: "ready", title: "جاهزة للتسليم", next: "delivered", action: "تم التسليم", color: "bg-it-green" },
];

export default function KitchenPage() {
  const { orders, online, reload } = useOpenOrders();
  const [, setTick] = useState(0);
  const newCount = orders.filter((o) => o.status === "new").length;
  const lastNewCount = useRef(newCount);

  // Refresh "منذ 5 د" every 30 seconds
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // Beep when a new order arrives
  useEffect(() => {
    if (newCount > lastNewCount.current) beep();
    lastNewCount.current = newCount;
  }, [newCount]);

  async function moveTo(order, status) {
    await supabase.from("orders").update({ status }).eq("id", order.id);
    reload();
  }

  return (
    <main className="p-4">
      <p className="text-sm text-ink-soft mb-3">
        <span className={`inline-block w-2 h-2 rounded-full ml-2 ${online ? "bg-it-green" : "bg-it-red"}`} />
        {online ? "متصل، الطلبات بتظهر لحالها" : "جاري الاتصال..."}
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        {lanes.map((lane) => {
          const list = orders.filter((o) => o.status === lane.status);
          return (
            <section key={lane.status} className="bg-paper rounded-2xl p-3 min-w-0">
              <div className="flex items-center justify-between px-2 pb-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${lane.color}`} />
                  {lane.title}
                </h2>
                <span className="font-latin text-xl">{list.length}</span>
              </div>

              <div className="space-y-3">
                {list.length === 0 && <p className="text-center text-ink-soft text-sm py-8">لا يوجد طلبات</p>}

                {list.map((order) => (
                  <article key={order.id} className="bg-white/70 rounded-xl p-4 border border-ink/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-latin text-2xl">#{order.order_number}</p>
                        <p className="font-bold">{orderPlace(order)}</p>
                      </div>
                      <span className="text-xs text-ink-soft">{timeAgo(order.created_at)}</span>
                    </div>

                    <ul className="mt-3 space-y-1">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="text-lg">
                          <b className="font-latin">{item.quantity}×</b> {item.product_name}
                        </li>
                      ))}
                    </ul>

                    {order.notes && (
                      <p className="mt-3 text-sm bg-ember/10 text-ember rounded-lg px-3 py-2">ملاحظة: {order.notes}</p>
                    )}

                    <button
                      onClick={() => moveTo(order, lane.next)}
                      className="w-full mt-4 bg-ink text-paper rounded-full py-2.5 font-bold"
                    >
                      {lane.action}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

// A short sound made by the browser (no sound file needed)
function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Some browsers block sound until the page is clicked
  }
}
