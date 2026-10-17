import { NotasModelo } from './modelo.js';
import { NotasVista } from './vista.js';
import { NotasControlador } from './controlador.js';
import { TermometroVista } from './termometro-vista.js';
import { AlmacenSesion } from './almacen.js';

const modelo = new NotasModelo(new AlmacenSesion('notas.v1'));
const vista = new NotasVista(modelo);
new NotasControlador(modelo, vista);
new TermometroVista(document.getElementById('termometro'), modelo);
