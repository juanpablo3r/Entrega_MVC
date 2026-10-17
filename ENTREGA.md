# Entrega: Laboratorio MVC — Del espagueti al MVC

Equipo 5

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

## 5. Evidencia de la Parte 5

### Parte 5A
```
commit 42b8d9aa5b8c1423e038ccfe85a7a6636eb2cf2b
Author: juanpablocardonamira38@gmail.com <johnemma2310@gmail.com>

    Parte 5A: nombres unicos

 src/modelo.js | 3 +++
 1 file changed, 3 insertions(+)
```

### Parte 5B
```
commit 155d5344bcd01c523a7cb2449c6f181878472542
Author: juanpablocardonamira38@gmail.com <johnemma2310@gmail.com>

    Parte 5B: termometro

 src/almacen.js          | 39 +++++++++++++++++++++++++++++++++++++++
 src/main.js             | 10 ++++++++++
 src/termometro-vista.js | 35 +++++++++++++++++++++++++++++++++++
 3 files changed, 84 insertions(+)
```

### Parte 5C
```
commit 75e5bbb57ad961bb0ab278422560db72f07422f0
Author: juanpablocardonamira38@gmail.com <johnemma2310@gmail.com>

    Parte 5C: almacen de sesion

 src/almacen.js | 5 +++++
 src/main.js    | 4 ++--
 2 files changed, 7 insertions(+), 2 deletions(-)
```
