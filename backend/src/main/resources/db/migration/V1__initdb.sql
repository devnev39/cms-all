use cms;
create table role (
    id int primary key auto_increment,
    type char(10) unique key   
);

create table user(
    id int primary key AUTO_INCREMENT,
    role_id int,
    name varchar(50),
    email varchar(50),
    password varchar(255),
    mobile varchar(13),
    created_at datetime default (sysdate()),
    updated_at datetime  default (sysdate()),
    created_by varchar(50),
    updated_by varchar(50),
    constraint fk_role_id foreign key (role_id) references role(id)
);

create table caterer (
    id int primary key auto_increment,
    name varchar(50),
    user_id int ,
    created_at datetime default (sysdate()),
    updated_at datetime  default (sysdate()),
    created_by varchar(50),
    updated_by varchar(50),
    constraint fk_user_id foreign key (user_id) references user(id)
);

create table item (
    id int primary key auto_increment,
    caterer_id int,
    name varchar(50),
    price float,
    created_at datetime default (sysdate()),
    updated_at datetime default (sysdate()),
    created_by varchar(50),
    updated_by varchar(50),
    constraint fk_caterer_id foreign key (caterer_id) references caterer(id)
);

create table coupon (
    id int primary key auto_increment,
    coupon_type_id int,
    customer_id int,
    count int,
    validity datetime,
    created_at datetime default (sysdate()),
    updated_at datetime default (sysdate()),
    created_by varchar(50),
    updated_by varchar(50)
);

create table coupon_types (
    id int primary key auto_increment,
    caterer_id int,
    type char(5),
    min_count int,
    original_price float,
    discount_per_coupon float,
    created_at datetime default (sysdate()),
    updated_at datetime default (sysdate()),
    created_by varchar(50),
    updated_by varchar(50),
    constraint fk_coupon_types_caterer_id foreign key (caterer_id) references caterer(id)
);

create table `order` (
    id int primary key auto_increment,
    user_id int,
    created_at datetime default (sysdate()),
    total_amount float,
    razorpay_payment_id char(50),
    razorpay_order_id char(50),
    razorpay_signature char(50),
    payment_method char(5),
    constraint fk_order_user_id foreign key (user_id) references user(id)
);

create table order_detail (
    id int primary key auto_increment,
    item_id int,
    order_id int,
    quantity int,
    price_per_unit float,
    constraint fk_order_detail_item_id foreign key (item_id) references item(id),
    constraint fk_order_detail_order_id foreign key (order_id) references `order`(id)
);

create table coupon_usage (
    id int primary key auto_increment,
    coupon_id int,
    created_at datetime default (sysdate()),
    updated_at datetime default (sysdate()),
    created_by varchar(50),
    constraint fk_coupon_usage_coupon_id foreign key (coupon_id) references coupon(id)
);

