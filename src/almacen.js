export class AlmacenMemoria {
  #datos;
  constructor(inicial = []) {
    this.#datos = inicial.map((e) => ({ ...e }));
  }
  cargar() {
    return this.#datos.map((e) => ({ ...e }));
  }
  guardar(lista) {
    this.#datos = lista.map((e) => ({ ...e }));
  }
}

class AlmacenWeb {
  #storage;
  #clave;
  constructor(storage, clave) {
    this.#storage = storage;
    this.#clave = clave;
  }
  cargar() {
    try {
      const lista = JSON.parse(this.#storage.getItem(this.#clave));
      return Array.isArray(lista) ? lista : [];
    } catch {
      return [];
    }
  }
  guardar(lista) {
    this.#storage.setItem(this.#clave, JSON.stringify(lista));
  }
}

export class AlmacenLocal extends AlmacenWeb {
  constructor(clave = 'notas.v1') {
    super(globalThis.localStorage, clave);
  }
}

export class AlmacenSesion extends AlmacenWeb {
  constructor(clave = 'notas.v1') {
    super(globalThis.sessionStorage, clave);
  }
}
