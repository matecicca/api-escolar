import { useState } from 'react'
import './App.css'

function App() {

  const nombre =  "adelga";
  const fecha = "29-09-2025"
  const titulo2 = <h2>La fecha es {fecha}</h2>

  const convertir = (texto) => {
    return texto.toUpperCase();
  }

  const doble = (num) => {
    return num * 2;
  }

  return (
    <>
    <h1>REACT DE {convertir(nombre)}</h1>
    <br/> {/*Obligatorio el cierre de todas las etiquetas*/}
      {titulo2}
      <p className="colorV">V{doble(2)}</p>
    </>
          
    
  )
}

export default App
