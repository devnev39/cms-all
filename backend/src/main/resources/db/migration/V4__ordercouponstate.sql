-- Change order_details and coupon table to include the state of the item and coupon type at the time of transaction.

alter Table order_detail
drop FOREIGN KEY fk_order_detail_item_id,
drop column item_id,
add column item_name varchar(50),
add column item_price float,
add column caterer_name varchar(50);

alter table coupon
drop column coupon_type_id,
add column coupon_type varchar(50),
add column coupon_type_min_count int,
add column coupon_type_original_price float,
add column coupon_type_discount_per_coupon float,
add column caterer_id int,
add constraint fk_coupon_caterer_id foreign key (caterer_id) references caterer(id);

-- SELECT
--     CONSTRAINT_NAME,
--     COLUMN_NAME,
--     REFERENCED_TABLE_NAME,
--     REFERENCED_COLUMN_NAME
-- FROM
--     INFORMATION_SCHEMA.KEY_COLUMN_USAGE
-- WHERE
--     TABLE_SCHEMA = 'cms' AND TABLE_NAME = 'coupon'
--     AND REFERENCED_TABLE_NAME IS NOT NULL;
