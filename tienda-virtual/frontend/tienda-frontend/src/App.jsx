import { useState } from 'react';
import Home from './pages/Home';
import Registro from './registro';

function App(irARegistro) {
  
  // Array que almacenará los productos del carrito
  const [carrito, setCarrito] = useState([]);
  // Almacena la categoría para filtrar productos
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  // Añade un producto al carrito
  const handleAddToCart = producto => {
    setCarrito(prev => [...prev, producto]);
  };

  // Vacía completamente el carrito
  const handleClearCart = () => {
    setCarrito([]);
  };

  const [busqueda, setBusqueda] = useState('');

  const handleMostrarRegistro = () => {
    setVista('registro');
  };

  // 👉 Si estamos en la vista de registro, muestra solo el formulario
  if (vista === 'registro') {
    return <Registro onVolver={() => setVista('home')} />;
  }

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

        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button
          onClick={handleMostrarRegistro}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '1rem',
            backgroundColor: 'white',
            color: '#6DBB4B',
            border: '2px solid #6DBB4B',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Registro
        </button>
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
          {/* Calcula el total del carrito */}
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