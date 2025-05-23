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
    cursor.execute("""
        SELECT p.idProducto, p.nombre, p.precio, p.imagen_url, p.cantidad,
            c.nombre AS categoria,
            r.tipo AS peso_o_resistencia,
            co.nombre AS color
        FROM productos p
        LEFT JOIN categoria c ON p.categoria = c.id_categoria
        LEFT JOIN peso_o_resistencia r ON p.peso_o_resistencia = r.id_peso_o_resistencia
        LEFT JOIN color co ON p.color = co.id_color
    """)

    productos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(productos)

# Guardar carrito con detalles (nueva ruta)

@app.route('/api/guardar_carrito', methods=['POST'])
def guardar_carrito():

    datos = request.json 
    nombre = datos.get('nombre')
    detalles = datos.get('carrito')

    if not nombre or not detalles:
        return jsonify({'error': 'Nombre y carrito son obligatorios'}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    cursor.execute("INSERT INTO carrito (nombre_usuario, estado) VALUES (%s, 'activo')", (nombre,))
    conn.commit()
    id_carrito = cursor.lastrowid

    for item in detalles:
        cursor.execute("""
            INSERT INTO detallesCarrito (idCarrito, idProducto, cantidad)
            VALUES (%s, %s, %s)
        """, (id_carrito, item['idProducto'], item.get('cantidad', 1)))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'mensaje': 'Carrito guardado con éxito', 'idCarrito': id_carrito})



@app.route('/api/registrar_venta', methods=['POST'])
def registrar_venta():

    data = request.json 
    detalles = data.get('carrito')
    nombre = data.get('nombre')
    numero_venta = data.get('numero_venta')

    if not detalles or not nombre or not numero_venta:
        return jsonify({'error': 'Faltan datos'}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    cursor.execute("INSERT INTO carrito (nombre_usuario, estado) VALUES (%s, 'finalizado')", (nombre,))
    conn.commit()
    id_carrito = cursor.lastrowid

    for item in detalles:
        cursor.execute("""
            INSERT INTO detallesCarrito (idCarrito, idProducto, cantidad)
            VALUES (%s, %s, %s)
        """, (id_carrito, item['idProducto'], item.get('cantidad', 1)))

    cursor.execute("""
        SELECT SUM(p.precio * dc.cantidad)
        FROM detallesCarrito dc
        JOIN productos p ON dc.idProducto = p.idProducto
        WHERE dc.idCarrito = %s
    """, (id_carrito,))
    total = cursor.fetchone()[0] or 0.0

    cursor.execute("""
        INSERT INTO venta (carrito_id, numero_venta, total)
        VALUES (%s, %s, %s)
    """, (id_carrito, numero_venta, total))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'mensaje': 'Venta registrada', 'idCarrito': id_carrito})


if __name__ == '__main__':
    app.run(debug=True)

    