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

const procesando = {
  1: false,
  2: false,
  3: false
};

let clienteId = 1;

function agregarTransaccion(ventanilla, tipo) {
  if (!tipo) return;

  const tiempo = tiempos[tipo];
  const cola = colas[ventanilla];

  const transaccion = {
    tipo,
    cliente: `Cliente ${clienteId++}`,
    duracion: tiempo * 1000
  };

  cola.push(transaccion);
  renderizarCola(ventanilla);

  if (!procesando[ventanilla]) {
    procesarCola(ventanilla);
  }
}

function renderizarCola(ventanilla) {
  const ul = document.getElementById(`cola${ventanilla}`);
  ul.innerHTML = "";
  colas[ventanilla].forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.cliente;
    ul.appendChild(li);
  });
}

function procesarCola(ventanilla) {
  if (colas[ventanilla].length === 0) {
    procesando[ventanilla] = false;
    return;
  }

  procesando[ventanilla] = true;

  const transaccion = colas[ventanilla][0];
  const tiempoInicio = Date.now();
  const tiempoFin = tiempoInicio + transaccion.duracion;

  console.log(`🟢 Iniciando ${transaccion.tipo} de ${transaccion.cliente} en ventanilla ${ventanilla}`);

  const intervalo = setInterval(() => {
    const ahora = Date.now();
    const restantes = Math.max(0, Math.ceil((tiempoFin - ahora) / 1000));
    console.log(`${transaccion.cliente} en ventanilla ${ventanilla} - ${restantes}s restantes`);

    if (ahora >= tiempoFin) {
      clearInterval(intervalo);
      console.log(`✅ ${transaccion.tipo} de ${transaccion.cliente} completado en ventanilla ${ventanilla}`);
      colas[ventanilla].shift();
      renderizarCola(ventanilla);
      procesarCola(ventanilla);
    }
  }, 1000);
}

function nuevoCliente() {
  const tipo = document.getElementById("tipoTransaccion").value;
  const ventanilla = parseInt(document.getElementById("ventanillaDestino").value);

  if (!tipo) {
    alert("Selecciona un tipo de transacción.");
    return;
  }

  agregarTransaccion(ventanilla, tipo);
  document.getElementById("tipoTransaccion").value = "";
}
