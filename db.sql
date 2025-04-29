create table if not exist roles (
    int id primary key auto_increment,
    char(10) type unique key   
);

create table if not exist users(
    int id primary key AUTO_INCREMENT,
    int role_id,
    name varchar(50),
    email varchar(50),
    password varchar(255),
    mobile varchar(13),
    datetime created_at default (sysdate()),
    datetime updated_at default (sysdate()),
    int updated_by,
    int created_by,
    constraint fk_role_id foreign key (role_id) references roles(id)
);

