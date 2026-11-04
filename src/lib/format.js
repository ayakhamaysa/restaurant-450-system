import { restaurant } from "../config";

export const money = (value) => `${Number(value || 0)} ${restaurant.currency}`;

// "الآن"، "منذ 5 دقائق"...
export function timeAgo(date) {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} د`;
  return `منذ ${Math.floor(minutes / 60)} س`;
}

// Where the order is going: table number or takeaway name
export const orderPlace = (order) =>
  order.order_type === "takeaway" ? `سفري · ${order.customer_name}` : `طاولة ${order.table_number}`;
