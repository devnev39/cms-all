```mermaid
erDiagram
    erDiagram
    user {
        int id pk
        int role_id fk
        varchar(25) name
        varchar(25) email uk "Not sure to be UK"
        varchar(50) password
        varchar(11) mobile
        datetime created_at
        datetime updated_at
        int updated_by
        int created_by
    }

    caterer {
        int id pk
        varchar(25) name
        int user_id fk
        datetime created_at
        datetime updated_at
        int updated_by
        int created_by
    }

    role {
        int id pk
        char(5) type uk
    }

    item {
        int id pk
        int caterer_id fk
        varchar(25) name
        float price
        int created_by fk
    }

    coupon_types {
        int id pk
        int caterer_id fk
        char(5) type
        int min_count
        float original_price
        float discount_per_coupon
    }

    coupon {
        int id pk
        int customer_id fk
        int count
        char(5) coupon_type
        int coupon_type_min_count
        float coupon_type_original_price
        float coupon_type_discount_per_coupon
        datetime validity
        datetime created_at
        datetime updated_at
        int created_by fk
        int updated_by fk
    }

    orders {
        int id pk
        int caterer_id fk
        int customer_id fk
        datetime created_at
        float total_amount
        char(5) payment_method
        varchar(50) razorpay_order_id
        varchar(50) razorpay_payment_id
    }

    order_details {
        int id pk
        int order_id fk
        int quantity
        float price_per_unit "Can be used in case of discounts"
        varchar(50) caterer_name
        varchar(50) item_name
        float item_price
    }

    coupon_usage {
        int id pk
        int coupon_id fk
        datetime created_at
        datetime updated_at
        int created_by fk
    }

    user ||--|| role: "has one"
    user }o--|| caterer: "Many user can be associated with one caterer"

    item }o--|| caterer: "Caterer's items"

    orders }o--|| caterer: "Orders of specific caterer"
    orders }o--|| user: "Customer places orders"

    coupon }o--|| caterer: "Caterer manages coupons"

    order_details }o--|| orders: "Details about different items and quantity"

    coupon_types }o--|| caterer: "Each caterer will have multiple coupon types"
    
    coupon_usage }o--|| coupon: "Each coupon use tracked"
```
