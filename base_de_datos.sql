-- ELIMINACIÓN DE LA BASE DE DATOS SI EXISTE
DROP DATABASE IF EXISTS tienda;

-- CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE tienda;

-- CREACIÓN DEL USUARIO Y ASIGNACIÓN DE PERMISOS
CREATE USER IF NOT EXISTS 'flaskuser'@'localhost' IDENTIFIED BY 'flaskpass';
GRANT ALL PRIVILEGES ON tienda.* TO 'flaskuser'@'localhost';
FLUSH PRIVILEGES;

USE tienda;

-- ELIMINACIÓN DE TABLAS SI EXISTEN (en orden para evitar conflictos por claves foráneas)
DROP TABLE IF EXISTS venta;
DROP TABLE IF EXISTS detallesCarrito;
DROP TABLE IF EXISTS carrito;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS peso_o_resistencia;
DROP TABLE IF EXISTS color;
DROP TABLE IF EXISTS categoria;

-- TABLAS:

-- CATEGORIA
CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- COLOR
CREATE TABLE IF NOT EXISTS color (
    id_color INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- PESO O RESISTENCIA
CREATE TABLE IF NOT EXISTS peso_o_resistencia (
    id_peso_o_resistencia INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL
);

-- PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
    idProducto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria INT,
    peso_o_resistencia INT,
    color INT,
    precio DECIMAL(10,2) NOT NULL,
    imagen_url VARCHAR(255),
    cantidad INT,
    FOREIGN KEY (categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (peso_o_resistencia) REFERENCES peso_o_resistencia(id_peso_o_resistencia),
    FOREIGN KEY (color) REFERENCES color(id_color)
);

-- CARRITO
CREATE TABLE IF NOT EXISTS carrito (
    idCarrito INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'finalizado') DEFAULT 'activo'
);


-- DETALLE CARRITO
CREATE TABLE IF NOT EXISTS detallesCarrito (
    idDetallesCarrito INT AUTO_INCREMENT PRIMARY KEY,
    idCarrito INT,
    idProducto INT,
    cantidad INT,
    FOREIGN KEY (idCarrito) REFERENCES carrito(idCarrito),
    FOREIGN KEY (idProducto) REFERENCES productos(idProducto)
);

-- VENTA (vincula a un carrito finalizado)
CREATE TABLE IF NOT EXISTS venta (
    idVenta INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT NOT NULL UNIQUE,
    numero_venta VARCHAR(50) UNIQUE NOT NULL,
    total DECIMAL(10,2),
    FOREIGN KEY (carrito_id) REFERENCES carrito(idCarrito)
);

-- INSERCIÓN DE TUPLAS:

INSERT INTO categoria (nombre) VALUES 
('Fuerza y Tonificación'),
('Cardio y Agilidad'),
('Yoga y Bienestar');

INSERT INTO color (nombre) VALUES 
('Negro'), ('Rojo'), ('Azul'), ('Verde'), ('Gris');

INSERT INTO peso_o_resistencia (tipo) VALUES 
('1kg'), ('2kg'), ('2.5kg'), ('3kg'), ('5kg'), ('7kg'), ('9kg'),
('10kg'), ('12kg'), ('15kg'), ('25kg'), ('35kg'), ('45kg'),
('60kg'), ('170cm'), ('180cm');

INSERT INTO productos (nombre, categoria, peso_o_resistencia, color, precio, imagen_url, cantidad) VALUES
('Mancuerna Ecológica', 1, 3, 1, 12.99, 'img/mancuerna_2_5kg.png', 10),
('Mancuerna Ecológica', 1, 5, 1, 17.99, 'img/mancuerna_5kg.png', 10),
('Mancuerna Ecológica', 1, 8, 1, 25.99, 'img/mancuerna_10kg.png', 10),
('Mancuerna Ecológica', 1, 10, 1, 32.99, 'img/mancuerna_15kg.png', 10),
('Comba Ecológica', 2, NULL, 2, 9.99, 'img/comba_roja.png', 10),
('Comba Ecológica', 2, NULL, 1, 9.99, 'img/comba_negra.png', 10),
('Comba Ecológica', 2, NULL, 3, 9.99, 'img/comba_azul.png', 10),
('Comba Ecológica', 2, NULL, 4, 9.99, 'img/comba_verde.png', 10),
('Comba Ecológica', 2, NULL, 5, 9.99, 'img/comba_gris.png', 10),
('Esterilla Ecológica', 3, 15, 2, 17.99, 'img/esterilla_roja_170.png', 10),
('Esterilla Ecológica', 3, 16, 2, 19.99, 'img/esterilla_roja_180.png', 10),
('Esterilla Ecológica', 3, 15, 1, 17.99, 'img/esterilla_negra_170.png', 10),
('Esterilla Ecológica', 3, 16, 1, 19.99, 'img/esterilla_negra_180.png', 10),
('Esterilla Ecológica', 3, 15, 3, 17.99, 'img/esterilla_azul_170.png', 10),
('Esterilla Ecológica', 3, 16, 3, 19.99, 'img/esterilla_azul_180.png', 10),
('Balón Ecológico', 1, 1, NULL, 8.99, 'img/balon_1kg.png', 10),
('Balón Ecológico', 1, 2, NULL, 10.99, 'img/balon_2kg.png', 10),
('Balón Ecológico', 1, 4, NULL, 12.99, 'img/balon_3kg.png', 10),
('Balón Ecológico', 1, 5, NULL, 14.99, 'img/balon_5kg.png', 10),
('Balón Ecológico', 1, 6, NULL, 16.99, 'img/balon_7kg.png', 10),
('Balón Ecológico', 1, 7, NULL, 18.99, 'img/balon_9kg.png', 10),
('Balón Ecológico', 1, 9, NULL, 20.99, 'img/balon_12kg.png', 10),
('Banda Ecológica', 1, 5, NULL, 15.99, 'img/banda_5kg.png', 10),
('Banda Ecológica', 1, 10, NULL, 15.99, 'img/banda_15kg.png', 10),
('Banda Ecológica', 1, 11, NULL, 19.99, 'img/banda_25kg.png', 10),
('Banda Ecológica', 1, 12, NULL, 23.99, 'img/banda_35kg.png', 10),
('Banda Ecológica', 1, 13, NULL, 26.99, 'img/banda_45kg.png', 10),
('Banda Ecológica', 1, 14, NULL, 29.99, 'img/banda_60kg.png', 10),
('Rueda Abdominal Ecológica', 1, NULL, NULL, 25.99, 'img/rueda_abdominal.png', 10);
