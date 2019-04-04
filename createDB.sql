DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(5,3) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("journal", "stationary", 5.00, 10),
("pen", "stationary", 2.00, 20),
("succulent", "decoration", 8.50, 25),
("geometric wall art", "decoration", 10.00, 5),
("japanese chocolate", "snack", 3.00, 30),
("popcorn", "snack", 1.00, 40),
("chelsea boots", "shoes", 20.00, 10),
("white sneakers", "shoes", 45.00, 15),
("sci fi", "books", 10.00, 40),
("cookbook", "books", 20.00, 50)
;