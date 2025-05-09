import { useState } from 'react';
import Home from './pages/Home';

function App() {
  const [carrito, setCarrito] = useState([]);

  const handleAddToCart = producto => {
    setCarrito(prev => [...prev, producto]);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Tienda Virtual</h1>
      <Home onAddToCart={handleAddToCart} />
      <div style={{ position: 'fixed', top: 20, right: 20, background: '#eee', padding: '1rem' }}>
        <h2>🛒 Carrito ({carrito.length})</h2>
        <ul>
          {carrito.map((item, index) => (
            <li key={index}>{item.nombre} - {item.precio} €</li>
          ))}
        </ul>
        <p><b>Total:</b> {carrito.reduce((acc, item) => acc + parseFloat(item.precio), 0).toFixed(2)} €</p>
      </div>
    </div>
  );
}

export default App;
