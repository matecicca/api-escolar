import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Curso(props) {
  const { titulo, precio } = props;
  return (
    <div className='card'>
      <h4>{ titulo }</h4>
      <p>Descripción del Curso</p>
      <strong>$ {precio}</strong>
      <button>Comprar</button>
    </div>
  )
}


function App() {
  const url = 'https://cdn.prod.website-files.com/662fb92f905585b61b12afd8/666af67c534d424825188e46_loop_pcy%20saying%20hi%20crop.gif';
  let descripcion = "GIf de Pocoyo";
  let logueado = true;
  const texto = logueado ? 'Bienvenido' : 'No autorizado';
  const cursos = [
    {id: 1, titulo: 'Aprenda HTML', precio: 20000 },
    {id: 2, titulo: 'Fundamentos de JavaScript', precio: 25000 },
    {id: 3, titulo: 'Diseño Responsive', precio: 30000 },
    {id: 4, titulo: 'Backend con PHP', precio: 21000 }
  ];
  //const result = cursos.map( item => item.titulo.toUpperCase()  );
  // console.log(result)
  return (
    <>
      <h1>Cursos</h1>
      <h2> { texto }</h2>
      {
        cursos.map( item => <Curso titulo={item.titulo} precio={item.precio} />  )
      }
      
     

      <p>Web de cursos </p>
      <hr />
      <ul>
        {
           cursos.map(  item =>  <li key={item.id}> 
                                    <strong>{ item.titulo }</strong> |  
                                    <span> ${ item.precio } </span>
                                  </li> )
        }
      </ul>

      {
        logueado ? (
          <img 
            className='animacion' 
            src={url} 
            alt="Pocoyo" 
            title={descripcion} 
          />
        ) : (
          <h2> Chau!</h2>
        )
      }
      
    </>
  )
}

export default App
