import { useState } from 'react';
import App from './App';
import Registro from './registro';

export default function Root() {
  const [vista, setVista] = useState('home'); // puede ser 'home' o 'registro'

  return (
    <>
      {vista === 'home' && <App irARegistro={() => setVista('registro')} />}
      {vista === 'registro' && <Registro volver={() => setVista('home')} />}
    </>
  );
}