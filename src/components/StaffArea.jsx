import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ItalyLine from "./ItalyLine";

// Wraps the kitchen and cashier pages.
// Shows a login form until the staff account signs in.
export default function StaffArea({ children }) {
  const [session, setSession] = useState(undefined); // undefined = still checking

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  if (!session) return <Login />;

  const link = ({ isActive }) =>
    `px-4 py-1.5 rounded-full text-sm transition ${isActive ? "bg-paper text-ink" : "text-paper/80 hover:text-paper"}`;

  return (
    <div className="min-h-screen bg-paper-dark">
      <header className="bg-ink text-paper">
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <p className="font-latin text-xl" dir="ltr">450<span className="text-ember">•</span></p>
          <nav className="flex gap-1">
            <NavLink to="/kitchen" className={link}>المطبخ</NavLink>
            <NavLink to="/cash" className={link}>الكاش</NavLink>
          </nav>
          <button onClick={() => supabase.auth.signOut()} className="text-sm text-paper/60 hover:text-paper">
            خروج
          </button>
        </div>
        <ItalyLine />
      </header>
      {children}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError("الإيميل أو كلمة السر غير صحيحة");
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-paper w-full max-w-sm rounded-3xl p-8">
        <p className="font-latin text-5xl text-center" dir="ltr">450<span className="text-ember">•</span></p>
        <p className="text-center text-ink-soft mt-2">دخول الموظفين</p>
        <ItalyLine className="w-16 mx-auto mt-4" />

        <input
          id="staff-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="الإيميل"
          dir="ltr"
          className="w-full mt-6 bg-white/60 border border-ink/15 rounded-xl px-4 py-3 text-right"
          required
        />
        <input
          id="staff-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة السر"
          className="w-full mt-3 bg-white/60 border border-ink/15 rounded-xl px-4 py-3"
          required
        />

        {error && <p className="text-it-red text-sm mt-3">{error}</p>}

        <button disabled={busy} className="w-full mt-5 bg-ink text-paper rounded-full py-3 font-bold disabled:opacity-60">
          {busy ? "..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
