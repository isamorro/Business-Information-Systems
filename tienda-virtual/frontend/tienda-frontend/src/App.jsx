import { useState } from 'react';
import Home from './pages/Home';

function App() {
  const [carrito, setCarrito] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const handleAddToCart = producto => {
    setCarrito(prev => [...prev, producto]);
  };

  const handleClearCart = () => {
    setCarrito([]);
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

      {/* Contenido principal: categorías + productos + carrito */}
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

        {/* Productos */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Home onAddToCart={handleAddToCart} categoriaSeleccionada={categoriaSeleccionada} />
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
