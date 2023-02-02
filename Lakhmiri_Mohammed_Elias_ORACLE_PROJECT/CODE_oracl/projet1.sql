
--CREATION DES TABLES
CREATE TABLE customer (
  customer_id INTEGER GENERATED AS IDENTITY PRIMARY KEY,
  name varchar2(50) NOT NULL,
  email varchar2(50) NOT NULL
);

CREATE TABLE car(
  car_id INTEGER GENERATED AS IDENTITY PRIMARY KEY,
  customer_id INTEGER not null,
  car_model varchar2(50) NOT NULL,
  price int NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

--CREATION DES UTILISATEURS

create user AD1 identified by AD1 default tablespace users;
create user N1 identified by N1 default tablespace users;

--Remplissage

INSERT INTO customer (name, email) VALUES ('elias', 'elias@gmail.com');
INSERT INTO customer (name, email) VALUES ('Lakhmiri', 'Lakhmiri@gmail.com');

INSERT INTO car (customer_id, car_model, price) VALUES (1, 'bmw M5', 120);
INSERT INTO car (customer_id, car_model, price) VALUES (2, 'mercede 220', 65);





select  * from car;
select  * from customer;

--des test avec revoke/grant pour changer les privilege

revoke all privileges from AD1;
grant all privileges to AD1;
grant create session to N1;
grant select on car  to N1;
revoke select on car  from N1;


