import { ErrorDeReglas } from './modelo.js';

const aNota = (texto) => (String(texto).trim() === '' ? null : Number(texto));

export class NotasControlador {
  #modelo;
  #vista;

  constructor(modelo, vista) {
    this.#modelo = modelo;
    this.#vista = vista;

    vista.alAgregar(({ nombre, peso, nota }) =>
      this.#intentar(() => this.#modelo.agregar({ nombre, peso: Number(peso), nota: aNota(nota) }), true));
    vista.alEliminar((id) => this.#intentar(() => this.#modelo.eliminar(id)));
    vista.alCalificar((id, texto) => this.#intentar(() => this.#modelo.calificar(id, aNota(texto))));
  }

  #intentar(orden, limpiarFormulario = false) {
    try {
      orden();
      this.#vista.limpiarError();
      if (limpiarFormulario) this.#vista.limpiarFormulario();
    } catch (error) {
      if (!(error instanceof ErrorDeReglas)) throw error;
      this.#vista.mostrarError(error.message);
      this.#vista.render();
    }
  }
}
