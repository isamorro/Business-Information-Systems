import { useState } from 'react';
import Home from './pages/Home';

function App() {

  // Estado local de las componentes  
  const [carrito, setCarrito] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccion, setDireccion] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [compraRealizada, setCompraRealizada] = useState(false);
  const [resumenNombre, setResumenNombre] = useState('');
  const [resumenCarrito, setResumenCarrito] = useState([]);


  // Añade al carrito un nuevo producto  
  const handleAddToCart = (producto) => {
    // Añade los que ya estaban y añade el nuevo producto con cantidad 1
    setCarrito(prev => [...prev, { ...producto, cantidad: 1 }]);
  };

  // Limpiamos carrito
  const handleClearCart = () => {
    setCarrito([]);
  };

  // Elimina un producto del carrito
  const handleRemoveFromCart = (indexToRemove) => {
    setCarrito(prev => prev.filter((_, index) => index !== indexToRemove));
  };  
  
  // Resgistramos la venta
  const handleRegistrarVenta = async () => {

    if (!nombre.trim() || !email.trim() || !contrasena.trim() || !direccion.trim() || !tarjeta.trim()) {
      alert("Por favor, completa todos los campos antes de continuar.");
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
      setResumenNombre(nombre);
      setResumenCarrito(carrito);
      setCarrito([]);
      setNombre('');
      setEmail('');
      setContrasena('');
      setDireccion("");
      setTarjeta("");
      setCompraRealizada(true);

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

          <button
            onClick={() => setMostrarFormulario(true)}
            style={{
              backgroundColor: '#388e3c',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold',
              marginTop: '1rem'
            }}
          >
            Finalizar Compra
          </button>

        </aside>
      </div>

      {mostrarFormulario && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '450px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            position: 'relative',
            fontFamily: 'sans-serif'
          }}>
            <button
              onClick={() => setMostrarFormulario(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '1.5rem',
                border: 'none',
                background: 'transparent',
                color: '#888',
                cursor: 'pointer'
              }}
              aria-label="Cerrar"
            >
              &times;
            </button>

            <h2 style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
              fontWeight: '600',
              color: '#2e7d32'
            }}>
              Registro del usuario
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); handleRegistrarVenta(); }}>
              {[
                { label: "Nombre", value: nombre, onChange: setNombre },
                { label: "Email", value: email, onChange: setEmail, type: "email" },
                { label: "Contraseña", value: contrasena, onChange: setContrasena, type: "password" },
                { label: "Dirección", value: direccion, onChange: setDireccion },
                { label: "Tarjeta", value: tarjeta, onChange: setTarjeta, type: "password" }
              ].map((field, idx) => (
                <div key={idx} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.25rem' }}>{field.label}:</label>
                  <input
                    type={field.type || "text"}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: '1px solid #ccc',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              ))}

              <button
                type="submit"
                style={{
                  backgroundColor: '#43a047',
                  color: 'white',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={e => e.target.style.backgroundColor = '#388e3c'}
                onMouseOut={e => e.target.style.backgroundColor = '#43a047'}
              >
                Confirmar Registro
              </button>
            </form>
          </div>
        </div>
      )}
      {compraRealizada && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            position: 'relative',
            fontFamily: 'sans-serif'
          }}>
            <h2 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '1rem' }}>
              ✅ ¡Compra realizada con éxito!
            </h2>

            <h4 style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>Resumen del pedido:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {carrito.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                  {item.nombre} - {item.precio} €
                </li>
              ))}
            </ul>
            <p style={{ textAlign: 'center' }}>
              Gracias por tu pedido, <strong>{resumenNombre}</strong>.
            </p>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {resumenCarrito.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                  {item.nombre} - {item.precio} €
                </li>
              ))}
            </ul>

            <p style={{ textAlign: 'center' }}>
              <strong>Total:</strong> {resumenCarrito.reduce((acc, item) => acc + parseFloat(item.precio), 0).toFixed(2)} €
            </p>


            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => {
                  setCompraRealizada(false);
                  setMostrarFormulario(false);
                }}
                style={{
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  padding: '0.6rem 1.2rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default App;