-- =========================================================
-- Pizzeria 450° — المنيو
-- شغّليه بعد setup-450.sql. انتبهي: بيمسح المنيو والطلبات القديمة (تبع البارون)
-- ويحط منيو 450 مكانها. شغّليه مرة وحدة بالبداية بس.
-- بعد هيك عدّلي الأسعار والأصناف من Table Editor.
-- =========================================================

begin;
delete from public.order_items;
delete from public.orders;
delete from public.products;
delete from public.categories;

insert into public.categories (name, name_en, sort_order, is_compact) values ('بيتزا', 'Pizza', 1, false);
insert into public.categories (name, name_en, sort_order, is_compact) values ('باستا', 'Pasta', 2, false);
insert into public.categories (name, name_en, sort_order, is_compact) values ('السلطات', 'Salads', 3, false);
insert into public.categories (name, name_en, sort_order, is_compact) values ('المقبلات', 'Appetizers', 4, false);
insert into public.categories (name, name_en, sort_order, is_compact) values ('فطور', '450° Breakfast', 5, false);
insert into public.categories (name, name_en, sort_order, is_compact) values ('حلويات', 'Desserts', 6, false);
insert into public.categories (name, name_en, sort_order, is_compact) values ('مشروبات', 'Drinks', 7, true);

insert into public.products (category_id, name, name_en, description, price, sort_order)
select c.id, v.name, v.name_en, v.description, v.price, v.sort_order
from (values
  ('بيتزا', 'مارينارا', 'Marinara', 'طماطم سان مارزانو، زيت زيتون بكر ممتاز، أوريغانو، ثوم، ريحان، بندورة كرزية', 33, 1),
  ('بيتزا', 'مارغريتا', 'Margherita', 'طماطم سان مارزانو، جبنة فيور دي لاتيه، بارميجيانو ريجيانو، زيت زيتون بكر ممتاز، ريحان', 35, 2),
  ('بيتزا', 'خضار', 'Verdure', 'طماطم سان مارزانو، جبنة فيور دي لاتيه، فطر، بندورة كرزية، زيتون كالاماتا، ريحان، زيت زيتون بكر ممتاز', 38, 3),
  ('بيتزا', 'ديافولا', 'Diavola', 'طماطم سان مارزانو، جبنة بيكورينو، فيور دي لاتيه، سلامي، زيت زيتون بكر ممتاز، ريحان', 40, 4),
  ('بيتزا', 'بيستو', 'Pesto', 'بيستو، بندورة كرزية، فطر، جبنة فيور دي لاتيه، بندورة مجففة، زيت زيتون بكر ممتاز', 42, 5),
  ('بيتزا', 'ترافل', 'Truffle', 'كريمة الترافل، فطر، ترافل، جبنة فيور دي لاتيه، بارميجيانو ريجيانو', 48, 6),
  ('بيتزا', 'بولو', 'Pollo', 'دجاج، كريمة الفطر، فطر سوتيه، جبنة فيور دي لاتيه، بارميجيانو ريجيانو', 55, 7),
  ('بيتزا', 'كواترو فورماجي', 'Quattro Formaggi', 'فيور دي لاتيه، تاليجيو، غورغونزولا، بارميجيانو ريجيانو، فستق، عسل', 55, 8),
  ('باستا', 'فيتوتشيني ترافل', 'Truffle Fettuccine', 'كريمة الترافل، فطر، ترافل، جبنة فيور دي لاتيه، بارميجيانو ريجيانو', 45, 1),
  ('باستا', 'بيني بيستو', 'Pesto Penne', 'بيستو، فطر، بندورة كرزية، جبنة فيور دي لاتيه', 45, 2),
  ('باستا', 'بيني ألفريدو', 'Penne Alfredo', 'كريمة ألفريدو، فطر، جبنة فيور دي لاتيه، بارميجيانو ريجيانو', 40, 3),
  ('باستا', 'سباغيتي بومودورو', 'Spaghetti Pomodoro', 'طماطم سان مارزانو، زيت زيتون بكر ممتاز، ريحان', 40, 4),
  ('السلطات', 'كبريزي', 'Caprese', 'بندورة كرزية، موزاريلا بيبي، ريحان، بيستو، فينيغريت', 30, 1),
  ('السلطات', 'سيزر', 'Caesar', 'خس، خبز محمص، صوص سيزر، جبنة بارميزان', 25, 2),
  ('السلطات', 'بانزانيلا', 'Panzanella', 'بندورة كرزية، ريحان، بصل أحمر، خبز محمص، فينيغريت', 23, 3),
  ('المقبلات', 'بروسكيتا بالطماطم', 'Tomato Bruschetta', 'خبز محمص، خليط الطماطم والريحان، زيت زيتون بكر ممتاز', 23, 1),
  ('المقبلات', 'بروسكيتا بالبيستو والبوراتا', 'Pesto & Burrata Bruschetta', 'خبز محمص مع البيستو، بندورة كرزية، جبنة بوراتا', 30, 2),
  ('المقبلات', 'تاجلييري', 'Tagliere', 'تشكيلة أجبان 450° مع خبز محمص', 33, 3),
  ('المقبلات', 'أصابع موزاريلا', 'Mozzarella Sticks', 'أربع أصابع موزاريلا', 27, 4),
  ('المقبلات', 'شيبس', 'French Fries', '', 15, 5),
  ('المقبلات', 'ودجز', 'Potato Wedges', '', 17, 6),
  ('فطور', 'مناقيش زعتر', 'Zaatar Manakish', '', 15, 1),
  ('فطور', 'مناقيش جبنة', 'Cheese Manakish', '', 18, 2),
  ('حلويات', 'تيراميسو', 'Tiramisu', '', 25, 1),
  ('مشروبات', 'ليمونادا نابوليتانا', 'Limonata Napoletana', '', 15, 1),
  ('مشروبات', 'إسبريسو', 'Espresso', '', 12, 2),
  ('مشروبات', 'شاي', 'Tea', '', 8, 3),
  ('مشروبات', 'مياه صغيرة', 'Small Water', '', 4, 4),
  ('مشروبات', 'مياه كبيرة', 'Large Water', '', 8, 5),
  ('مشروبات', 'مياه غازية', 'Sparkling Water', '', 9, 6),
  ('مشروبات', 'كولا', 'Cola', '', 4, 7),
  ('مشروبات', 'كولا زيرو', 'Cola Zero', '', 4, 8),
  ('مشروبات', 'سبرايت', 'Sprite', '', 4, 9),
  ('مشروبات', 'سبرايت دايت', 'Sprite Diet', '', 4, 10),
  ('مشروبات', 'فانتا', 'Fanta', '', 4, 11)
) as v(category, name, name_en, description, price, sort_order)
join public.categories c on c.name = v.category;

commit;
