from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from db_config import db_config

app = Flask(__name__)
CORS(app)

# Obtener productos (ya lo tenías)
@app.route('/api/productos', methods=['GET'])
def get_productos():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos")
    productos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(productos)

# Guardar carrito con detalles (nueva ruta)
@app.route('/api/agregar_producto_carrito', methods=['POST'])
def agregar_producto_carrito():
    data = request.json  # {'idProducto': 3, 'cantidad': 1}

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Crear nuevo carrito si no hay uno activo
    cursor.execute("INSERT INTO carrito () VALUES ()")
    conn.commit()
    id_carrito = cursor.lastrowid

    # Insertar el producto en detallesCarrito
    cursor.execute("""
        INSERT INTO detallesCarrito (idCarrito, idProducto, cantidad)
        VALUES (%s, %s, %s)
    """, (id_carrito, data['idProducto'], data.get('cantidad', 1)))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'mensaje': 'Producto añadido al carrito', 'idCarrito': id_carrito})

if __name__ == '__main__':
    app.run(debug=True)