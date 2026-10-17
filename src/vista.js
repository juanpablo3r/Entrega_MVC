const TEXTO_ESTADO = {
  aprobado: ['¡Aprobado! Ya aseguraste la nota mínima.', 'estado ok'],
  'en-camino': (n) => [`En camino: necesitas ${n} en lo que falta.`, 'estado en-camino'],
  'en-riesgo': (n) => [`En riesgo: necesitas ${n} en lo que falta.`, 'estado riesgo'],
  imposible: ['Imposible aprobar con las notas actuales.', 'estado imposible'],
};

const redondear2 = (n) => Math.round(n * 100) / 100;

export class NotasVista {
  #modelo;
  #el;

  constructor(modelo) {
    this.#modelo = modelo;
    const $ = (id) => document.getElementById(id);
    this.#el = {
      formulario: $('formulario'),
      nombre: $('nombre'),
      peso: $('peso'),
      nota: $('nota'),
      error: $('error'),
      tabla: $('tabla'),
      vacio: $('vacio'),
      acumulado: $('acumulado'),
      pesoCalificado: $('pesoCalificado'),
      pesoPendiente: $('pesoPendiente'),
      necesaria: $('necesaria'),
      estado: $('estado'),
    };
    modelo.suscribir(() => this.render());
    this.render();
  }


  alAgregar(manejador) {
    this.#el.formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      manejador(this.leerFormulario());
    });
  }

  alEliminar(manejador) {
    this.#el.tabla.addEventListener('click', (evento) => {
      const boton = evento.target.closest('button[data-eliminar]');
      if (boton) manejador(Number(boton.dataset.eliminar));
    });
  }

  alCalificar(manejador) {
    this.#el.tabla.addEventListener('change', (evento) => {
      const campo = evento.target.closest('input[data-nota]');
      if (campo) manejador(Number(campo.dataset.nota), campo.value);
    });
  }


  leerFormulario() {
    return { nombre: this.#el.nombre.value, peso: this.#el.peso.value, nota: this.#el.nota.value };
  }
  limpiarFormulario() {
    this.#el.formulario.reset();
  }
  mostrarError(mensaje) {
    this.#el.error.textContent = mensaje;
  }
  limpiarError() {
    this.#el.error.textContent = '';
  }


  render() {
    const evaluaciones = this.#modelo.evaluaciones;
    const r = this.#modelo.resumen();

    this.#el.tabla.replaceChildren(...evaluaciones.map((e) => this.#fila(e)));
    this.#el.vacio.hidden = evaluaciones.length > 0;

    this.#el.acumulado.textContent = r.acumulado.toFixed(2);
    this.#el.pesoCalificado.textContent = `${redondear2(r.pesoCalificado)} %`;
    this.#el.pesoPendiente.textContent = `${redondear2(r.pesoPendiente)} %`;
    this.#el.necesaria.textContent = r.notaNecesaria === null ? '—' : r.notaNecesaria.toFixed(2);

    const necesaria = r.notaNecesaria === null ? '' : r.notaNecesaria.toFixed(2);
    const def = TEXTO_ESTADO[r.estado];
    const [texto, clase] = typeof def === 'function' ? def(necesaria) : def;
    this.#el.estado.textContent = texto;
    this.#el.estado.className = clase;
  }

  #fila(e) {
    const tr = document.createElement('tr');
    const celda = (contenido) => {
      const td = document.createElement('td');
      if (typeof contenido === 'string') td.textContent = contenido;
      else td.append(contenido);
      tr.append(td);
    };

    const entrada = document.createElement('input');
    entrada.type = 'number';
    entrada.min = '0';
    entrada.max = '5';
    entrada.step = 'any';
    entrada.value = e.nota === null ? '' : String(e.nota);
    entrada.dataset.nota = String(e.id);

    const borrar = document.createElement('button');
    borrar.type = 'button';
    borrar.textContent = 'Eliminar';
    borrar.dataset.eliminar = String(e.id);

    celda(e.nombre);
    celda(`${e.peso} %`);
    celda(entrada);
    celda(e.nota === null ? '—' : ((e.peso * e.nota) / 100).toFixed(2));
    celda(borrar);
    return tr;
  }
}
