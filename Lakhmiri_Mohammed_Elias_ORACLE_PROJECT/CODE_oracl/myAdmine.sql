select * from projet.car;
select * from projet.customer;
-- par contre dans au niveau d'utilisateur (ADMIN)
--on vat pas renconter de probleme car il possede toute les privileges
INSERT INTO projet.car (customer_id, car_model, price) VALUES (3, 'Hoonigan', 170);
INSERT INTO projet.customer (name, email) VALUES ('Mohammed', 'Mohammed@gmail.com');
