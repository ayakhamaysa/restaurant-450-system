import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

// All orders that are not paid yet, with their items.
// Updates by itself when anything changes (Supabase Realtime).
export function useOpenOrders() {
  const [orders, setOrders] = useState([]);
  const [online, setOnline] = useState(false);
  const timer = useRef(null);

  const reload = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .is("paid_at", null)
      .neq("status", "cancelled")
      .order("created_at");
    if (!error) setOrders(data);
  }, []);

  useEffect(() => {
    reload();

    // Many changes can arrive together, so wait a moment and reload once
    const scheduleReload = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(reload, 200);
    };

    const channel = supabase
      .channel("open-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, scheduleReload)
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, scheduleReload)
      .subscribe((status) => setOnline(status === "SUBSCRIBED"));

    return () => {
      clearTimeout(timer.current);
      supabase.removeChannel(channel);
    };
  }, [reload]);

  return { orders, online, reload };
}
