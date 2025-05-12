import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function Home({ onAddToCart }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {

    axios.get('http://localhost:5000/api/productos')
      .then(res => setProductos(res.data));

  }, []);

  return (
    
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '2rem' }}>
      
      {productos.map(producto => (
        
        <ProductCard key={producto.id} producto={producto} onAddToCart={onAddToCart} />
     
      ))}

    </div>
    
  );
}

export default Home;
