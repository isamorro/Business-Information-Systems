import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';


// Recibe función para agregar al carrito y categoría seleccionada
function Home({ onAddToCart, categoriaSeleccionada }) {

  // Almacenará los productos obtenidos desde la base de datos
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Petición a la BD
    axios.get('http://localhost:5000/api/productos')
      .then(res => setProductos(res.data));
  }, []);

  // Si la categoría es Todas no filtra, en otro caso filtra por categoría
  const productosFiltrados = productos.filter(producto =>
    categoriaSeleccionada === 'Todas' || producto.categoria === categoriaSeleccionada
  );

  return (

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '2rem' }}>
      {productosFiltrados.map(producto => (
        <ProductCard key={producto.id} producto={producto} onAddToCart={onAddToCart} />
      ))}
    </div>
    
  );
}


export default Home;
