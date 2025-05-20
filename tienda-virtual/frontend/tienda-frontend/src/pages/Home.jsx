import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';


// Recibe función para agregar al carrito y categoría seleccionada
function Home({ onAddToCart, categoriaSeleccionada, busqueda }) {

  // Almacenará los productos obtenidos desde la base de datos
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Petición a la BD
    axios.get('http://localhost:5000/api/productos')
      .then(res => setProductos(res.data));
  }, []);

  // Si la categoría es Todas no filtra, en otro caso filtra por categoría
  const productosFiltrados = productos.filter(producto => {
  const coincideCategoria = categoriaSeleccionada === 'Todas' || producto.categoria === categoriaSeleccionada;
  const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           producto.categoria.toLowerCase().includes(busqueda.toLowerCase());
  return coincideCategoria && coincideBusqueda;
  });

  return (

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.5rem',
      }}>
      {productosFiltrados.map(producto => (
        <ProductCard key={producto.id} producto={producto} onAddToCart={onAddToCart} />
      ))}
    </div>
    
  );
}


export default Home;
