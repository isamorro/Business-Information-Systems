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

  const handleAddToCart = (producto) => {
    setCarrito(prev => [...prev, { ...producto, cantidad: 1 }]);
  };

  const handleClearCart = () => {
    setCarrito([]);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCarrito(prev => prev.filter((_, index) => index !== indexToRemove));
  };  

  const handleGuardarCarrito = async () => {
    
    if (!nombre.trim()) {
      alert("Por favor, introduce tu nombre antes de guardar el carrito.");
      return;
    }
  
    const carritoFormateado = carrito.map(item => ({
      idProducto: item.idProducto,
      cantidad: item.cantidad || 1
    }));
  
    try {
      const res = await fetch('http://localhost:5000/api/guardar_carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, carrito: carritoFormateado })
      });
  
      const data = await res.json();
      setCarrito([]);
      setNombre('');
      setEmail('');
      setContrasena('');


    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  };
  

  const handleRegistrarVenta = async () => {

    if (!nombre.trim()) {
      alert("Por favor, introduce tu nombre antes de registrar la venta.");
      return;
    }
  
    const carritoFormateado = carrito.map(item => ({
      idProducto: item.idProducto,
      cantidad: item.cantidad || 1
    }));
  
    const ventaPayload = {
      nombre,
      carrito: carritoFormateado,
      numero_venta: `VENTA-${Date.now()}`
    };
  
    try {
      const res = await fetch('http://localhost:5000/api/registrar_venta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaPayload)
      });
  
      const data = await res.json();
      console.log('Venta registrada:', data);
      setCarrito([]);
      setNombre('');
      setEmail('');
      setContrasena('');

    } catch (error) {
      console.error('Error al registrar venta:', error);
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
          {['Todas', 'Fuerza y Tonificación', 'Cardio y Agilidad', 'Yoga y Bienestar'].map(cat => (
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
              <li key={index} style={{ marginBottom: '1rem' }}>
                <button
                  onClick={() => handleRemoveFromCart(index)}
                  style={{
                    marginTop: '0.3rem',
                    padding: '0.25rem 0.5rem',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  ❌
                </button>
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

          {/* Formulario de registro */}
          <div style={{
            backgroundColor: '#f4fdf4',
            border: '1px solid #c5e1a5',
            borderRadius: '12px',
            padding: '1rem',
            marginTop: '2rem'
          }}>
            <h3 style={{ color: '#388e3c', marginBottom: '1rem', textAlign: 'center' }}>
              ¡Rellene el formulario para terminar la compra!
            </h3>

            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Nombre:</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  style={{
                    width: '80%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
            
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  style={{
                    width: '80%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Contraseña:</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '80%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleGuardarCarrito();
                }}
              
                style={{
                  backgroundColor: '#6DBB4B',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: 'bold'
                }}
              >
                Guardar Carrito
                
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleRegistrarVenta();
                }}
                style={{
                  backgroundColor: '#388e3c',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: 'bold',
                  marginTop: '0.5rem'
                }}
              >
                Finalizar Compra

              </button>


            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
