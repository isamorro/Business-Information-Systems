function ProductCard({ producto, onAddToCart }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
      <img
        src={producto.imagen_url}
        alt={producto.nombre}
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
      />
      <h3> {producto.nombre} </h3>
      <p> {producto.precio} € </p>
      <p> {producto.peso_o_resistencia} </p>
      <p> {producto.categoria} </p>
      
      <button onClick={() => onAddToCart(producto)}>Añadir al carrito</button>
    </div>
  );
}

export default ProductCard;
