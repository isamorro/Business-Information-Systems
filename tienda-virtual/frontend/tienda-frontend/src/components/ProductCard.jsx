function ProductCard({ producto, onAddToCart }) {
    
    return (

      <div style={{ border: '1px solid #ccc', padding: '1rem', width: '200px' }}>
        <img src={producto.imagen} alt={producto.nombre} style={{ width: '100%' }} />
        <h3>{producto.nombre}</h3>
        <p>{producto.precio} €</p>
        <button onClick={() => onAddToCart(producto)}>Añadir al carrito</button>
      </div>
    
    );
  }
  
  export default ProductCard;
  