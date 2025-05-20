import { useState } from 'react';

function Registro({ volver }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    contrasena: '',
  });

  const [exito, setExito] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Datos registrados:', form);
    setExito(true);
    setForm({ nombre: '', email: '', contrasena: '' });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '2rem auto' }}>
      <h2>Formulario de Registro</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label><br />
        <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required /><br /><br />

        <label>Email:</label><br />
        <input type="email" name="email" value={form.email} onChange={handleChange} required /><br /><br />

        <label>Contraseña:</label><br />
        <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} required /><br /><br />

        <button type="submit">Registrarse</button>
      </form>

      {exito && <p style={{ color: 'green' }}>¡Registro exitoso!</p>}

      <br />
      <button onClick={volver} style={{ marginTop: '1rem' }}>Volver al inicio</button>
    </div>
  );
}

export default Registro;