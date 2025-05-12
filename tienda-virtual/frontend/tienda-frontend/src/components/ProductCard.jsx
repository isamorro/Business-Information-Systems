function ProductCard({ producto, onAddToCart }) {

  return (
  
  <div style={{ border: '1px solid #ccc', padding: '1rem', width: '200px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
    
    <img
      src={`/${producto.imagen_url}`}
      alt={producto.nombre}
      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
    />

    <h3>{producto.nombre}</h3>
    <p>{producto.precio} €</p>
    <p>{producto.peso_o_resistencia}</p>
    <p>{producto.categoria}</p>

    <button
      onClick={() => onAddToCart(producto)}
      style={{
        marginTop: '0.5rem',
        backgroundColor: '#6DBB4B',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
      }}
      onMouseOver={e => (e.target.style.backgroundColor = '#5AA03F')}
      onMouseOut={e => (e.target.style.backgroundColor = '#6DBB4B')}
    >
      Añadir al carrito
      
    </button>
  </div>
  
  );
}

export default ProductCard;