import { useState } from "react";
import { useMenu } from "../hooks/useMenu";
import Header from "../components/Header";
import CategoryNav from "../components/CategoryNav";
import MenuSection from "../components/MenuSection";
import Info from "../components/Info";
import ItalyLine from "../components/ItalyLine";
import Cart from "../components/Cart";

export default function MenuPage() {
  const { categories, loading, error } = useMenu();

  // The cart: { "<product id>": { item, quantity: 2 }, ... }
  const [cart, setCart] = useState({});

  function addToCart(item) {
    const quantity = (cart[item.id]?.quantity || 0) + 1;
    setCart({ ...cart, [item.id]: { item, quantity } });
  }

  function removeFromCart(item) {
    const quantity = (cart[item.id]?.quantity || 0) - 1;
    const next = { ...cart };
    if (quantity <= 0) delete next[item.id];
    else next[item.id] = { item, quantity };
    setCart(next);
  }

  return (
    <>
      <Header />
      {/* This line scrolls away with the header */}
      <ItalyLine />
      <CategoryNav categories={categories} />

      <main className="max-w-3xl mx-auto px-5 pb-28">
        {loading && <p className="text-center text-ink-soft py-16">جاري تحميل المنيو...</p>}
        {error && <p className="text-center text-it-red py-16">{error}</p>}

        {categories.map((category) => (
          <MenuSection
            key={category.id}
            category={category}
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
          />
        ))}

        <Info />

        <footer className="text-center text-xs text-ink-soft mt-12">
          تصميم وتطوير{" "}
          <a href="https://www.instagram.com/oneclick.ps" target="_blank" className="font-bold text-ink">
            One Click
          </a>
        </footer>
      </main>

      <Cart cart={cart} onAdd={addToCart} onRemove={removeFromCart} onClear={() => setCart({})} />
    </>
  );
}
