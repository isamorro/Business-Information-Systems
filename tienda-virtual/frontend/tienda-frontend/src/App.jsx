import { useState } from 'react';
import Home from './pages/Home';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  // Estado para el formulario de registro
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleAddToCart = async (producto) => {
  try {
    const res = await fetch('http://localhost:5000/api/agregar_producto_carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idProducto: producto.idProducto,
        cantidad: 1
      })
    });

    const data = await res.json();
    console.log(data.mensaje);
    alert('Producto añadido al carrito');
    
    // Opcional: también lo puedes mantener en el estado local
    setCarrito(prev => [...prev, { ...producto, cantidad: 1 }]);
  } catch (error) {
    console.error('Error al añadir al carrito:', error);
  }
};

  const handleClearCart = () => {
    setCarrito([]);
  };

  const handleRegistroSubmit = (e) => {
    e.preventDefault();
    console.log({ nombre, email, contrasena });
    setRegistroExitoso(true);
    setNombre('');
    setEmail('');
    setContrasena('');
  };

  const handleGuardarCarrito = async () => {
  const carritoFormateado = carrito.map(item => ({
    idProducto: item.idProducto,
    cantidad: item.cantidad || 1  // Puedes añadir selector de cantidad más adelante
  }));

  try {
    const res = await fetch('http://localhost:5000/api/guardar_carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carritoFormateado)
    });

    const data = await res.json();
    alert(`Carrito guardado con ID: ${data.idCarrito}`);
    setCarrito([]); // Limpiar carrito
  } catch (error) {
    console.error('Error al guardar el carrito:', error);
  }
};

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        background: '#6DBB4B',
        display: 'flex',
        alignItems: 'center',
        height: '120px',
        padding: '0 2rem',
        width: '100%'
      }}>
        <img src="/img/logo.jpeg" alt="Logo" style={{ height: '100%', objectFit: 'contain' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '2rem', color: 'white' }}>EcoFit</h1>
        </div>
      </header>

      {/* Contenido principal */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Menú de categorías */}
        <aside style={{
          width: '200px',
          background: '#f0f0f0',
          padding: '1rem',
          borderRight: '1px solid #ccc',
          boxSizing: 'border-box'
        }}>
          <h3>Categorías</h3>
          {['Todas', 'Fuerza y Tonificación', 'Cardio y Agilidad', 'Yoga y Estiramientos'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              style={{
                display: 'block',
                width: '100%',
                margin: '0.25rem 0',
                padding: '0.5rem',
                backgroundColor: categoriaSeleccionada === cat ? '#6DBB4B' : '#fff',
                color: categoriaSeleccionada === cat ? 'white' : 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </aside>

        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>

          {/* Buscador arriba de los productos */}
          <div style={{
            marginBottom: '1rem',
            display: 'flex',
            backgroundColor: '#f0f0f0',
            border: '2px solid #6DBB4B',
            borderRadius: '8px',
            padding: '0.25rem 0.75rem',
          }}>
            <input
              type="text"
              placeholder="🔎 Buscar productos ecológicos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '1rem',
                color: '#333'
              }}
            />
          </div>

          {/* Formulario de registro */}
          <div style={{
            backgroundColor: '#e8f5e9',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <h2>📝 Registro de Cliente</h2>
            <form onSubmit={handleRegistroSubmit}>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Nombre:</label><br />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Email:</label><br />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Contraseña:</label><br />
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#6DBB4B',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Registrarse
              </button>
            </form>
            {registroExitoso && (
              <p style={{ color: 'green', marginTop: '1rem' }}>¡Registro exitoso!</p>
            )}
          </div>

          {/* Productos */}
          <Home
            onAddToCart={handleAddToCart}
            categoriaSeleccionada={categoriaSeleccionada}
            busqueda={busqueda}
          />
        </main>

        {/* Carrito */}
        <aside style={{
          width: '300px',
          background: '#f9f9f9',
          padding: '1rem',
          borderLeft: '1px solid #ccc',
          boxSizing: 'border-box',
          overflowY: 'auto'
        }}>
          <h2>🛒 Carrito ({carrito.length})</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {carrito.map((item, index) => (
              <li key={index}>
                {item.nombre} - {item.precio} €<br />
                <small>{item.peso_o_resistencia}</small>
              </li>
            ))}
          </ul>
          <p><b>Total:</b> {carrito.reduce((acc, item) => acc + parseFloat(item.precio), 0).toFixed(2)} €</p>

          <button
            onClick={handleClearCart}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#d9534f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Vaciar carrito
          </button>
        </aside>

      </div>
    </div>
  );
}

export default App;
