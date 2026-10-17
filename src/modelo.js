export const NOTA_MINIMA = 3.0;
export const NOTA_MAXIMA = 5.0;
export const UMBRAL_RIESGO = 4.0;
export const EPS = 1e-9;

export class ErrorDeReglas extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorDeReglas';
  }
}

export function redondearArriba(n) {
  return Math.ceil(n * 100 - EPS) / 100 + 0;
}

export class NotasModelo {
  #almacen;
  #evaluaciones;
  #siguienteId;
  #suscriptores = new Set();

  constructor(almacen) {
    this.#almacen = almacen;
    this.#evaluaciones = (almacen.cargar() ?? []).map((e) => ({ ...e }));
    this.#siguienteId = this.#evaluaciones.reduce((m, e) => Math.max(m, e.id), 0) + 1;
  }

  get evaluaciones() {
    return this.#evaluaciones.map((e) => ({ ...e }));
  }


  agregar({ nombre, peso, nota } = {}) {
    const limpio = String(nombre ?? '').trim();
    if (limpio === '') throw new ErrorDeReglas('El nombre es obligatorio.');
    if (limpio.length > 40) throw new ErrorDeReglas('El nombre no puede superar 40 caracteres.');

    if (!Number.isFinite(peso) || peso < 1 || peso > 100) {
      throw new ErrorDeReglas('El peso debe estar entre 1 y 100.');
    }
    const notaFinal = nota ?? null;
    this.#validarNota(notaFinal);
    const usado = this.#evaluaciones.reduce((s, e) => s + e.peso, 0);
    if (usado + peso > 100 + EPS) {
      const quedan = Math.round((100 - usado) * 100) / 100;
      throw new ErrorDeReglas(`Los pesos no pueden sumar más de 100 % (te quedan ${quedan} %).`);
    }
    const evaluacion = { id: this.#siguienteId++, nombre: limpio, peso, nota: notaFinal };
    this.#evaluaciones.push(evaluacion);
    this.#cambio();
  }

  calificar(id, nota) {
    const evaluacion = this.#buscar(id);
    const notaFinal = nota ?? null;
    this.#validarNota(notaFinal);
    evaluacion.nota = notaFinal;
    this.#cambio();
  }

  eliminar(id) {
    const evaluacion = this.#buscar(id);
    this.#evaluaciones.splice(this.#evaluaciones.indexOf(evaluacion), 1);
    this.#cambio();
  }


  resumen() {
    const calificadas = this.#evaluaciones.filter((e) => e.nota !== null);
    const acumulado = calificadas.reduce((s, e) => s + (e.peso * e.nota) / 100, 0);
    const pesoCalificado = calificadas.reduce((s, e) => s + e.peso, 0);
    const pesoPendiente = 100 - pesoCalificado;

    let notaNecesaria = null;
    if (pesoPendiente > EPS) {
      notaNecesaria = redondearArriba(Math.max(0, (NOTA_MINIMA - acumulado) / (pesoPendiente / 100)));
    }

    let estado;
    if (acumulado >= NOTA_MINIMA - EPS) estado = 'aprobado';
    else if (notaNecesaria === null || notaNecesaria > NOTA_MAXIMA) estado = 'imposible';
    else if (notaNecesaria > UMBRAL_RIESGO) estado = 'en-riesgo';
    else estado = 'en-camino';

    return { acumulado, pesoCalificado, pesoPendiente, notaNecesaria, estado };
  }


  suscribir(fn) {
    this.#suscriptores.add(fn);
    return () => this.#suscriptores.delete(fn);
  }


  #buscar(id) {
    const evaluacion = this.#evaluaciones.find((e) => e.id === id);
    if (!evaluacion) throw new ErrorDeReglas('No existe la evaluación.');
    return evaluacion;
  }

  #validarNota(nota) {
    if (nota === null) return;
    if (!Number.isFinite(nota) || nota < 0 || nota > NOTA_MAXIMA) {
      throw new ErrorDeReglas('La nota debe estar entre 0 y 5.');
    }
  }

  #cambio() {
    this.#almacen.guardar(this.#evaluaciones.map((e) => ({ ...e })));
    for (const fn of this.#suscriptores) fn();
  }
}
