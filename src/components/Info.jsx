import { restaurant } from "../config";
import ItalyLine from "./ItalyLine";

export default function Info() {
  return (
    <section className="mt-20 rounded-3xl bg-ink text-paper p-8 text-center">
      <ItalyLine className="w-20 mx-auto mb-6" />
      <p className="font-script text-4xl" dir="ltr">Good Food, Good Mood</p>

      <div className="grid gap-6 sm:grid-cols-2 mt-8 text-sm">
        <div>
          <p className="font-latin tracking-[0.3em] text-paper/60 text-xs" dir="ltr">FIND US</p>
          <p className="mt-2">{restaurant.address}</p>
        </div>
        <div>
          <p className="font-latin tracking-[0.3em] text-paper/60 text-xs" dir="ltr">SERVICE</p>
          <p className="mt-2">{restaurant.serviceTypes}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <a
          href={`https://wa.me/${restaurant.whatsapp}`}
          target="_blank"
          className="bg-paper text-ink px-6 py-2.5 rounded-full font-medium hover:bg-white transition"
        >
          تواصل معنا
        </a>
        <a
          href={restaurant.instagram}
          target="_blank"
          className="border border-paper/40 px-6 py-2.5 rounded-full hover:border-paper transition"
        >
          إنستغرام
        </a>
      </div>
    </section>
  );
}
