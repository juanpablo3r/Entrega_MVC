# Entrega: Laboratorio MVC — Del espagueti al MVC

Equipo N

Integrantes:
- Juan Pablo Cardona Mira
- John Emmanuel Lopez
- Jose Daniel Saldariaga

## 2. Olores de diseño

| Olor | Consecuencia cuando el proyecto crece | Pieza donde vive la solución |
|---|---|---|
| Variables globales con el estado | Cualquier función puede dañar los datos y es difícil saber quién los cambió | Modelo: estado privado en `NotasModelo` |
| La misma regla escrita en dos funciones | Se corrige una y se olvida la otra, y la app se comporta distinto según el camino | Modelo: `#validarNota`, escrita una sola vez |
| Valor «mágico» 3.0 repetido | Cambiar la nota mínima obliga a buscar y editar muchos lugares | Modelo: constante `NOTA_MINIMA` |
| HTML armado con texto | Un nombre como `<b>hola</b>` se interpreta como HTML | Vista: `createElement` y `textContent` |
| Funciones que calculan, dibujan y guardan a la vez | No se pueden reutilizar ni probar por separado | Se reparten entre Modelo, Vista y Controlador |
| Almacenamiento disperso | Cambiar dónde se guardan los datos obliga a tocar todo el código | Almacén: `almacen.js` |
| Imposible probar sin navegador | Las reglas solo se pueden comprobar a mano | Modelo: pruebas con Node |

## 3. Flujo de agregar una evaluación

1. El usuario presiona Agregar y el navegador dispara el evento `submit` del formulario.
2. `vista.js`, `alAgregar`: el escuchador hace `preventDefault()` y llama a `leerFormulario()`, que devuelve el texto escrito.
3. `controlador.js`, constructor: el manejador convierte el texto a números y deja la nota en `null` si está vacía.
4. `controlador.js`, `#intentar`: ejecuta `modelo.agregar(...)`.
5. `modelo.js`, `agregar`: valida las reglas, crea la evaluación y la añade a la lista.
6. `modelo.js`, `#cambio`: llama a `almacen.guardar(...)` en `almacen.js`.
7. `modelo.js`, `#cambio`: avisa a los suscriptores.
8. `vista.js`, `render` y `termometro-vista.js`, `render`: leen `evaluaciones` y `resumen()` y redibujan.
9. `controlador.js`, `#intentar`: limpia el error y el formulario.

Si el Modelo lanza `ErrorDeReglas`, `#intentar` llama a `vista.mostrarError(mensaje)` y luego a `vista.render()`.
