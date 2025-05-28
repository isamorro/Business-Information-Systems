from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from db_config import db_config

# Iniciamos la aplicación
app = Flask(__name__)
CORS(app)

# Obtenemos productos (pedimos a la BD)
@app.route('/api/productos', methods=['GET'])
def get_productos():

    # Abrimos conexión a la base de datos
    conn = mysql.connector.connect(**db_config)
    # Obtenemos los resultados como diccionarios (clave-valor)
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

    # Obtenemos datos en productos
    productos = cursor.fetchall()
    # Cerramos conexión
    cursor.close()
    conn.close()
    # Devolvemos los datos de productos conn formato JSON
    return jsonify(productos)

# Guardar carrito con detalles (guardamos en la BD)
@app.route('/api/guardar_carrito', methods=['POST'])
def guardar_carrito():

    # Obtenemos datos
    datos = request.json 
    nombre = datos.get('nombre')
    detalles = datos.get('carrito')

    # Lanzamos error si no tenemos alguno de los datos
    if not nombre or not detalles:
        return jsonify({'error': 'Nombre y carrito son obligatorios'}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Creamos un nuevo registro en la tabla carrito
    cursor.execute("INSERT INTO carrito (nombre_usuario, estado) VALUES (%s, 'activo')", (nombre,))
    conn.commit()
    id_carrito = cursor.lastrowid

    # Insertamos cada producto en la tabla detallesCarrito
    for item in detalles:
        cursor.execute("""
            INSERT INTO detallesCarrito (idCarrito, idProducto, cantidad)
            VALUES (%s, %s, %s)
        """, (id_carrito, item['idProducto'], item.get('cantidad', 1)))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'mensaje': 'Carrito guardado con éxito', 'idCarrito': id_carrito})

# Registra al usuario
@app.route('/api/registrar_usuario', methods=['POST'])
def registrar_usuario():
    data = request.json
    nombre = data.get('nombre')
    email = data.get('email')
    contrasena = data.get('contrasena')
    direccion = data.get('direccion')
    tarjeta = data.get('tarjeta')

    if not all([nombre, email, contrasena, direccion, tarjeta]):
        return jsonify({'error': 'Faltan datos'}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO usuario (nombre, email, contrasena, direccion, tarjeta)
        VALUES (%s, %s, %s, %s, %s)
    """, (nombre, email, contrasena, direccion, tarjeta))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'mensaje': 'Usuario registrado con éxito'})


# Guarda la venta
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

    try:
        # Buscar el ID del usuario por su nombre (idealmente usar email si hay duplicados)
        cursor.execute("SELECT id FROM usuario WHERE nombre = %s", (nombre,))
        usuario = cursor.fetchone()
        if not usuario:
            return jsonify({'error': 'Usuario no registrado'}), 400

        id_usuario = usuario[0]

        # Crear carrito vinculado al usuario
        cursor.execute("INSERT INTO carrito (id_usuario, estado) VALUES (%s, 'finalizado')", (id_usuario,))
        conn.commit()
        id_carrito = cursor.lastrowid

        # Insertar detalles del carrito
        for item in detalles:
            cursor.execute("""
                INSERT INTO detallesCarrito (idCarrito, idProducto, cantidad)
                VALUES (%s, %s, %s)
            """, (id_carrito, item['idProducto'], item.get('cantidad', 1)))

        # Calcular total de la compra
        cursor.execute("""
            SELECT SUM(p.precio * dc.cantidad)
            FROM detallesCarrito dc
            JOIN productos p ON dc.idProducto = p.idProducto
            WHERE dc.idCarrito = %s
        """, (id_carrito,))
        total = cursor.fetchone()[0] or 0.0

        # Registrar venta
        cursor.execute("""
            INSERT INTO venta (carrito_id, numero_venta, total)
            VALUES (%s, %s, %s)
        """, (id_carrito, numero_venta, total))

        conn.commit()
        return jsonify({'mensaje': 'Venta registrada', 'idCarrito': id_carrito})

    except Exception as e:
        conn.rollback()
        return jsonify({'error': f'Error al registrar venta: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()




if __name__ == '__main__':
    app.run(debug=True)

    