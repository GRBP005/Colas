const tiempos = {
  deposito: 30,
  retiro: 45,
  transaccion: 50,
  crearCuenta: 60,
  prestamo: 90
};

const colas = {
  1: [],
  2: [],
  3: []
};

function agregarTransaccion(ventanilla, tipo) {
  if (!tipo) return;

  const tiempo = tiempos[tipo];
  const cola = colas[ventanilla];
  const tiempoInicio = cola.length > 0 ? cola[cola.length - 1].fin : Date.now();
  const tiempoFinal = tiempoInicio + tiempo * 1000;

  const transaccion = {
    tipo,
    inicio: tiempoInicio,
    fin: tiempoFinal
  };

  cola.push(transaccion);
  renderizarCola(ventanilla);
  procesarCola(ventanilla);
}

function renderizarCola(ventanilla) {
  const ul = document.getElementById(`cola${ventanilla}`);
  ul.innerHTML = "";
  colas[ventanilla].forEach((item, index) => {
    const li = document.createElement("li");
    const segundosRestantes = Math.max(0, Math.ceil((item.fin - Date.now()) / 1000));
    li.textContent = `${item.tipo} - ${segundosRestantes}s restantes`;
    ul.appendChild(li);
  });
}

function procesarCola(ventanilla) {
  if (colas[ventanilla].length === 0) return;

  const intervalo = setInterval(() => {
    const ahora = Date.now();
    const cola = colas[ventanilla];

    if (cola.length && cola[0].fin <= ahora) {
      cola.shift(); // quitar la transacción completada
    }

    renderizarCola(ventanilla);

    if (cola.length === 0) {
      clearInterval(intervalo);
    }
  }, 1000);
}
