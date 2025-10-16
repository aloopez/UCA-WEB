import { useMemo, useState } from "react";
import "./App.css";

const ListItem = (props: any) => {
  console.log({ props });
  const { element } = props;
  return (
    <div
      id={`data_${element.id}`}
      style={{
        borderBottom: "solid 1px #2e1ebaff",
        marginBottom: 10,
      }}
    >
      <div
        style={
          element.isActive
            ? {
                backgroundColor: "rgba(64, 204, 57, 1)",
                width: "100%",
                height: 20,
              }
            : {
                backgroundColor: "rgba(190, 13, 13, 1)",
                width: "100%",
                height: 20,
              }
        }
      />
      <p>{element.name}</p>
      <p>{element.gender}</p>
      <p>{element.age}</p>
      <p>{element.country}</p>
      <img src={element.picture} alt={element.name} />
    </div>
  );
};

function App() {
  const [dataSet, setDataSet] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("todos");

  const [modoOscuro, setModoOscuro] = useState(true);

  const extractData = async () => {
    const res = await fetch("http://localhost:3001/findUsers");
    const parsedRes = await res.json();
    if (!parsedRes.status) return;

    setDataSet(parsedRes.data);
  };

  const LIST = useMemo(() => {
    // AÑADE ESTA LÓGICA DE FILTRADO
    const listaFiltrada = dataSet.filter((el: any) => {
      if (filtro === "activos") {
        return el.isActive === true;
      }
      if (filtro === "inactivos") {
        return el.isActive === false;
      }
      // Si el filtro es "todos" o cualquier otra cosa, no filtres nada
      return true;
    });

    return listaFiltrada.length > 0
      ? listaFiltrada.map((el: any) => <ListItem key={el.id} element={el} />) // Añadido "key" para buenas prácticas
      : null;
  }, [dataSet, filtro]); // <-- AHORA DEPENDE DE dataSet Y filtro

  const temaCss = modoOscuro ? "dark" : "light";

  return (
    <div className={`app-container ${temaCss}`}>
      <button onClick={() => setModoOscuro(!modoOscuro)}>
        Cambiar a Modo {modoOscuro ? "Claro" : "Oscuro"}
      </button>

      <h1>Lista de elementos</h1>
      <div className="card">
        <button onClick={() => setFiltro("todos")}>Todos</button>
        <button onClick={() => setFiltro("activos")}>Activos</button>
        <button onClick={() => setFiltro("inactivos")}>Inactivos</button>
      </div>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "25vh",
          overflowY: "scroll",
          border: "solid 2px #dacdcdff",
          borderRadius: 5,
          padding: 5,
        }}
      >
        {LIST}
      </section>
      <div className="card">
        <button onClick={extractData}>Recuperar datos</button>
      </div>
    </div>
  );
}

export default App;
