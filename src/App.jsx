import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";

// Staff pages load only when someone opens them,
// so customers scanning the QR code download a smaller file.
const KitchenPage = lazy(() => import("./pages/KitchenPage"));
const CashPage = lazy(() => import("./pages/CashPage"));
const StaffArea = lazy(() => import("./components/StaffArea"));

// Pages:
// /         → the menu for customers (QR code points here)
// /kitchen  → kitchen screen (staff login)
// /cash     → cashier screen (staff login)
export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/kitchen" element={<StaffArea><KitchenPage /></StaffArea>} />
        <Route path="/cash" element={<StaffArea><CashPage /></StaffArea>} />
        <Route path="*" element={<MenuPage />} />
      </Routes>
    </Suspense>
  );
}
