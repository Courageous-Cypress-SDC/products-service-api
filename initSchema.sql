DROP DATABASE IF EXISTS products;

CREATE DATABASE products
WITH ENCODING = 'UTF8';

CREATE TABLE product_info (
  product_id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slogan VARCHAR(255),
  description TEXT,
  category VARCHAR(30) NOT NULL,
  default_price INT NOT NULL
);

CREATE TABLE styles (
  style_id SERIAL NOT NULL PRIMARY KEY,
  product_id BIGINT,
  name VARCHAR(100) NOT NULL,
  sale_price INT,
  original_price INT NOT NULL,
  if_default INT NOT NULL,
  FOREIGN KEY (product_id)
      REFERENCES product_info(product_id)
);



CREATE TABLE features (
  feature_id SERIAL NOT NULL PRIMARY KEY,
  product_id BIGINT NOT NULL,
  feature VARCHAR(50) NOT NULL,
  value VARCHAR(50) NOT NULL,
  FOREIGN KEY (product_id)
    REFERENCES product_info(product_id)
);



CREATE TABLE skus (
  sku_id SERIAL NOT NULL PRIMARY KEY,
  style_id BIGINT,
  size VARCHAR(15) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (style_id)
    REFERENCES styles(style_id)
);


CREATE TABLE photos (
  photo_id SERIAL NOT NULL PRIMARY KEY,
  style_id BIGINT,
  url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  FOREIGN KEY (style_id)
    REFERENCES styles(style_id)
);


CREATE INDEX idx_styles_product_id ON styles(product_id);
CREATE INDEX idx_features_product_id ON features(product_id);
CREATE INDEX idx_skus_style_id ON skus(style_id);
CREATE INDEX idx_photos_style_id ON photos(style_id);
