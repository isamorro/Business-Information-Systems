from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from db_config import db_config

app = Flask(__name__)
CORS(app)

@app.route('/api/productos')
def get_productos():
    
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos")
    productos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(productos)

if __name__ == '__main__':
    app.run(debug=True)
