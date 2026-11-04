import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Loads categories and products from Supabase
// and returns them in the same shape the menu components use.
export function useMenu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const [cats, prods] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("*").order("sort_order"),
      ]);

      if (cats.error || prods.error) {
        setError("تعذر تحميل المنيو، تأكد من الاتصال بالإنترنت");
        setLoading(false);
        return;
      }

      const result = cats.data.map((c) => ({
        id: c.id,
        titleAr: c.name,
        title: c.name_en,
        compact: c.is_compact,
        items: prods.data
          .filter((p) => p.category_id === c.id)
          .map((p) => ({
            id: p.id,
            name: p.name,
            nameEn: p.name_en,
            description: p.description,
            price: Number(p.price),
            image: p.image_url,
          })),
      }));

      // Hide empty categories
      setCategories(result.filter((c) => c.items.length > 0));
      setLoading(false);
    }

    load();
  }, []);

  return { categories, loading, error };
}
