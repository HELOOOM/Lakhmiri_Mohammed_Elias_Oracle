select * from projet.car;
select * from projet.customer;
-- si on teste d'insere comme suite on obtiendra une erreue de privileges insuffisants
INSERT INTO projet.car (customer_id, car_model, price) VALUES (3, 'Hoonigan', 170);
