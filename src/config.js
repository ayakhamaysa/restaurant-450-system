// ======================================================
// بيانات المطعم الثابتة (الهوية والتواصل)
// المنيو نفسه (الأقسام والأصناف والأسعار) موجود بـ Supabase
// ======================================================

export const restaurant = {
  name: "450",
  label: "PIZZERIA",
  subtitle: "NAPOLETANA",
  script: "La vera pizza napoletana",
  tagline: "قطعة من نابولي في جنين",
  services: ["Pizza", "Pasta", "Salad", "Dessert"],
  address: "جنين، بجانب بنك فلسطين",
  serviceTypes: "تناول داخل المطعم وطلبات سفري",
  whatsapp: "972594011424",
  instagram: "https://instagram.com/pizzeria.450",
  currency: "₪",

  // ordering: true  ← الزبون بيطلب من المنيو والطلب بيوصل للمطبخ
  // ordering: false ← منيو عرض بس
  ordering: true,
  tableCount: 15, // عدد الطاولات بالمطعم
};
