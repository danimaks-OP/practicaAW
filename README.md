# Práctica · Aplicaciones Web

## 1. Objetivo

Desarrollar una plataforma web para la gestión de un centro de formación, evolucionando progresivamente desde una aplicación HTML/CSS hasta una solución completa con JavaScript, Node.js, Express y MariaDB.

El desarrollo debe priorizar **funcionalidad, integración, calidad del código, accesibilidad, seguridad, responsive y capacidad de defensa**.

---

## 2. Arquitectura y tecnologías

```text
Frontend                         Backend                  Base de datos
HTML5 + CSS3 + JavaScript  ↔  Node.js + Express  ↔  MariaDB
              HTTP / JSON
```

### Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap (opcional/recomendado).
- **Backend:** Node.js + Express.
- **BD:** MariaDB.
- **Entorno:** VS Code, XAMPP, navegador.
- **Control de versiones:** GitHub opcional.

La documentación posterior del profesorado definirá la API REST, estructura recomendada y otros detalles técnicos.

---

# 3. Roles y permisos

## Alumno

Puede:

- Consultar, buscar, filtrar y ver cursos.
- Matricularse y cancelar matrículas.
- Consultar matrículas activas e históricas.
- Gestionar su perfil.
- Configurar accesibilidad.

## Administrador

Además de las funciones del alumno:

- Gestionar usuarios.
- Gestionar cursos.
- Gestionar docentes.
- Gestionar aulas.
- Gestionar matrículas.
- Importar datos JSON.
- Consultar estadísticas.
- Configurar la aplicación.

**El acceso a las funciones administrativas debe estar protegido por autenticación y rol.**

---

# 4. Funcionalidades a desarrollar

## 4.1 Usuarios

### Registro

Campos:

- Nombre
- Apellidos
- Email
- Contraseña
- Confirmación de contraseña

Validar:

- Campos obligatorios.
- Email válido.
- Contraseña segura.
- Coincidencia de contraseñas.
- Email no registrado.

### Autenticación

- Login mediante email + contraseña.
- Logout.
- Redirección según rol.
- Usuarios inactivos no pueden iniciar sesión.
- Gestión adecuada de sesiones.

### Perfil

Editable:

- Nombre
- Apellidos
- Teléfono
- Contraseña
- Preferencias de accesibilidad

El email **no puede modificarse**.

---

## 4.2 Cursos

El administrador dispone de CRUD completo:

- [ ] Alta
- [ ] Consulta
- [ ] Modificación
- [ ] Eliminación

Datos:

- Nombre
- Descripción
- Docente
- Aula
- Fecha de inicio
- Fecha de finalización
- Horario
- Número máximo de plazas
- Imagen
- Estado

El alumno debe disponer de:

- [ ] Catálogo
- [ ] Búsqueda
- [ ] Filtros
- [ ] Detalle del curso
- [ ] Matrícula desde el detalle

---

## 4.3 Docentes

CRUD completo:

- [ ] Alta
- [ ] Consulta
- [ ] Modificación
- [ ] Eliminación

Datos:

- Nombre
- Apellidos
- Especialidad
- Email
- Teléfono
- Fotografía
- Estado

Relación: un docente puede impartir varios cursos y cada curso tiene un único docente.

**No eliminar un docente con cursos asociados sin realizar previamente la reasignación correspondiente.**

---

## 4.4 Aulas

CRUD completo:

- [ ] Alta
- [ ] Consulta
- [ ] Modificación
- [ ] Eliminación

Datos:

- Nombre
- Edificio
- Planta
- Capacidad
- Equipamiento
- Estado

**No eliminar un aula asignada a un curso activo.**

---

## 4.5 Matrículas

### Alumno

- [ ] Matricularse.
- [ ] Consultar matrículas.
- [ ] Cancelar matrícula.
- [ ] Consultar histórico.

### Administrador

- [ ] Consultar.
- [ ] Dar de alta.
- [ ] Cancelar.

Antes de crear una matrícula comprobar:

```text
Curso activo
    ↓
¿Hay plazas?
    ↓
¿El alumno ya está matriculado?
    ↓
Crear matrícula
```

Reglas:

- No duplicar matrícula alumno/curso.
- No superar plazas.
- El curso debe estar activo.
- Fecha y estado se asignan automáticamente.
- Las matrículas canceladas permanecen en el histórico.

---

# 5. Modelo de datos

Entidades principales:

```text
USUARIOS 1 ─── N MATRÍCULAS N ─── 1 CURSOS
                                  │
                                  ├── N:1 DOCENTES
                                  │
                                  └── N:1 AULAS
```

### Usuarios

`id, nombre, apellidos, email, contraseña, rol, fecha_alta, estado, preferencias_accesibilidad`

### Docentes

`id, nombre, apellidos, especialidad, email, teléfono, fotografía, estado`

### Cursos

`id, nombre, descripción, docente, aula, fecha_inicio, fecha_fin, horario, plazas, imagen, estado`

### Aulas

`id, nombre, edificio, planta, capacidad, equipamiento, estado`

### Matrículas

`id, alumno, curso, fecha_matricula, estado`

El modelo inicial proporcionado por el profesorado puede modificarse o ampliarse si se mantiene la coherencia y se puede justificar.

---

# 6. Reglas de negocio

Estas comprobaciones deben existir **también en el servidor**, no únicamente en JavaScript:

- [ ] Usuario autenticado para acceder a funcionalidades privadas.
- [ ] Alumno no puede acceder a administración.
- [ ] No duplicar matrículas.
- [ ] No superar plazas.
- [ ] No matricular en cursos inactivos.
- [ ] No eliminar docente con cursos asociados sin reasignación.
- [ ] No eliminar aula de curso activo.
- [ ] Usuario inactivo no puede iniciar sesión.
- [ ] Email del usuario no modificable.
- [ ] Alta, modificación y eliminación requieren confirmación.
- [ ] Los errores deben mostrarse de forma clara.

---

# 7. Interfaz y navegación

Todas las páginas deben mantener una estructura homogénea:

```text
Navbar
   ↓
Contenido
   ↓
Footer
```

Menú mínimo:

- Inicio
- Cursos
- Docentes
- Aulas
- Mis matrículas
- Perfil
- Accesibilidad
- Administración *(solo administrador)*
- Cerrar sesión

Pantallas mínimas:

### Públicas

- [ ] Inicio
- [ ] Login
- [ ] Registro

### Alumno

- [ ] Catálogo
- [ ] Detalle de curso
- [ ] Mis matrículas
- [ ] Perfil
- [ ] Accesibilidad

### Administrador

- [ ] Dashboard
- [ ] Cursos
- [ ] Docentes
- [ ] Aulas
- [ ] Usuarios
- [ ] Matrículas
- [ ] Importación JSON
- [ ] Estadísticas

---

# 8. Formularios

Cada formulario debe tener validación y mensajes comprensibles.

### Curso

Nombre, descripción, docente, aula, fechas, horario, plazas, imagen y estado.

### Docente

Nombre, apellidos, especialidad, email, teléfono, fotografía y estado.

### Aula

Nombre, edificio, planta, capacidad, equipamiento y estado.

### Matrícula

Alumno y curso.

La fecha y el estado se generan automáticamente.

---

# 9. Accesibilidad

Implementar un panel con:

- [ ] Tema claro/oscuro.
- [ ] Tamaño de fuente.
- [ ] Alto contraste.

Además:

- [ ] Navegación completa mediante teclado.
- [ ] HTML semántico.
- [ ] `alt` en imágenes.
- [ ] Formularios accesibles.
- [ ] Mensajes de error comprensibles.

Las preferencias deben mantenerse durante la sesión y pueden persistirse mediante LocalStorage.

---

# 10. Responsive

Comprobar toda la aplicación en:

- [ ] Escritorio
- [ ] Tablet
- [ ] Móvil

Prestar especial atención a:

- Navbar.
- Tablas.
- Formularios.
- Tarjetas.
- Modales.
- Dashboard y estadísticas.

La interfaz debe reorganizarse correctamente al reducir el espacio disponible.

---

# 11. JavaScript y persistencia cliente

Durante el desarrollo deben incorporarse progresivamente:

- [ ] Manipulación del DOM.
- [ ] Validación de formularios.
- [ ] Componentes reutilizables.
- [ ] Fetch.
- [ ] JSON.
- [ ] LocalStorage.
- [ ] Actualización parcial de la interfaz.

LocalStorage puede utilizarse especialmente para las preferencias de accesibilidad.

---

# 12. Backend

Implementar progresivamente:

- [ ] Servidor Node.js.
- [ ] Express.
- [ ] API REST.
- [ ] Validación de datos.
- [ ] Lógica de negocio.
- [ ] Autenticación.
- [ ] Sesiones.
- [ ] Control de roles.
- [ ] Gestión de errores.
- [ ] Acceso a MariaDB.

**La validación del servidor debe considerarse obligatoria aunque el frontend ya valide los datos.**

---

# 13. Base de datos

Cuando el profesorado proporcione los recursos:

- [ ] Ejecutar `aw_practica.sql`.
- [ ] Revisar tablas.
- [ ] Revisar relaciones.
- [ ] Revisar diccionario de datos.
- [ ] Configurar conexión desde Node.js.
- [ ] Probar persistencia.

No fijar modificaciones al modelo sin justificarlas.

---

# 14. Importación JSON

Debe permitir cargar inicialmente:

- [ ] Docentes.
- [ ] Cursos.
- [ ] Aulas.

Resultado de cada importación:

- Registros insertados.
- Registros actualizados.
- Registros descartados.
- Errores detectados.

Flujo:

```text
JSON → Validación → Procesamiento → BD → Resumen
```

El formato definitivo debe seguir los ficheros proporcionados por el profesorado.

---

# 15. Estadísticas

El administrador debe poder consultar:

- [ ] Total de alumnos.
- [ ] Total de cursos.
- [ ] Total de docentes.
- [ ] Total de aulas.
- [ ] Cursos con más matriculados.
- [ ] Ocupación media de aulas.

Se valoran gráficas y un dashboard visual.

---

# 16. Desarrollo incremental

## Fase 1 — Estructura e interfaz

- [ ] Crear proyecto.
- [ ] Definir estructura.
- [ ] Navbar/Footer.
- [ ] Pantallas principales.
- [ ] Responsive.

## Fase 2 — JavaScript

- [ ] DOM.
- [ ] Formularios.
- [ ] Validaciones.
- [ ] Modales.
- [ ] Accesibilidad.

## Fase 3 — Persistencia cliente

- [ ] LocalStorage.
- [ ] Preferencias.

## Fase 4 — Backend

- [ ] Node.js.
- [ ] Express.
- [ ] API.
- [ ] Sesiones.
- [ ] Roles.
- [ ] Validación servidor.

## Fase 5 — MariaDB

- [ ] Base de datos oficial.
- [ ] Conexión.
- [ ] Consultas.
- [ ] Persistencia.

## Fase 6 — Integración

- [ ] Fetch.
- [ ] JSON.
- [ ] Frontend ↔ API.
- [ ] Gestión de errores.

## Fase 7 — Funcionalidades

- [ ] Usuarios.
- [ ] Cursos.
- [ ] Docentes.
- [ ] Aulas.
- [ ] Matrículas.

## Fase 8 — Funciones adicionales

- [ ] Importación JSON.
- [ ] Estadísticas.
- [ ] Accesibilidad completa.
- [ ] Seguridad.
- [ ] Mejoras de UX.

## Fase 9 — Revisión

- [ ] Pruebas completas.
- [ ] Responsive.
- [ ] Accesibilidad.
- [ ] Refactorización.
- [ ] Documentación.
- [ ] Preparación de defensa.

---

# 17. Pruebas mínimas

## Usuarios

- [ ] Registro válido/inválido.
- [ ] Email duplicado.
- [ ] Login correcto/incorrecto.
- [ ] Usuario inactivo.
- [ ] Permisos por rol.

## Cursos

- [ ] CRUD.
- [ ] Búsqueda/filtros.
- [ ] Detalle.
- [ ] Curso activo/inactivo.
- [ ] Sin plazas.

## Docentes

- [ ] CRUD.
- [ ] Asociación con cursos.
- [ ] Intento de eliminación con cursos.

## Aulas

- [ ] CRUD.
- [ ] Asociación con cursos.
- [ ] Intento de eliminación de aula de curso activo.

## Matrículas

- [ ] Alta.
- [ ] Duplicado.
- [ ] Sin plazas.
- [ ] Curso inactivo.
- [ ] Cancelación.
- [ ] Histórico.

## Importación

- [ ] JSON válido.
- [ ] JSON incorrecto.
- [ ] Datos incompletos.
- [ ] Insertados/actualizados/descartados/errores.

---

# 18. Calidad del código

Mantener:

- Separación de responsabilidades.
- Código modular.
- Nombres coherentes.
- Componentes reutilizables.
- Evitar duplicación.
- Gestión centralizada de errores cuando proceda.
- Estructura fácil de localizar durante la defensa.

La estructura concreta debe respetar las indicaciones del profesorado cuando sean publicadas.

---

# 19. Ampliaciones

Una vez terminados los requisitos obligatorios, se pueden valorar:

### Seguridad

- Protección de rutas.
- Contraseñas cifradas.
- Validación avanzada de servidor.

### Accesibilidad

- Preferencias persistentes.
- Atajos configurables.
- ARIA.
- Gestión del foco.

### Funcionalidad

- Dashboard interactivo.
- Calendario.
- API externa.
- Exportación.
- Notificaciones.
- Gestión documental.
- Administración avanzada.

Las ampliaciones no deben comprometer las funcionalidades obligatorias.

---

# 20. Recursos que faltan por incorporar

Mantener controlados los materiales que publique el profesorado:

- [ ] `aw_practica.sql`
- [ ] Diagrama ER
- [ ] Diccionario de datos
- [ ] JSON de docentes
- [ ] JSON de cursos
- [ ] JSON de aulas
- [ ] Especificación API REST
- [ ] Estructura recomendada
- [ ] Laboratorios
- [ ] Microhitos
- [ ] Documentación adicional

La documentación oficial más reciente prevalece sobre este README si se producen cambios.

---

# 21. Microhitos

Para cada microhito:

- [ ] Revisar requisitos.
- [ ] Implementar.
- [ ] Probar.
- [ ] Corregir errores.
- [ ] Integrar.
- [ ] Actualizar documentación.

Registrar:

```text
Microhito:
Fecha:
Requisitos:
Implementación:
Problemas:
Soluciones:
Pendientes:
```

Las fechas y criterios concretos serán los publicados en el Campus Virtual.

---

# 22. Entrega

Formato:

```text
gXX_PO.zip
```

Debe contener:

- [ ] Código fuente.
- [ ] SQL/base de datos necesarios.
- [ ] JSON utilizados.
- [ ] Recursos gráficos.
- [ ] CSS.
- [ ] JavaScript.
- [ ] Código servidor.
- [ ] Manual de instalación.
- [ ] Manual de usuario.

No incluir `node_modules` ni los archivos de datos proporcionados por el profesorado cuando se indique expresamente que no son necesarios.

Antes de entregar:

- [ ] Probar instalación desde cero.
- [ ] Restaurar BD.
- [ ] Instalar dependencias.
- [ ] Ejecutar aplicación.
- [ ] Probar funcionalidades obligatorias.
- [ ] Comprobar estructura.
- [ ] Comprobar recursos.
- [ ] Generar ZIP con nombre correcto.

---

# 23. Defensa

Todos los integrantes deben conocer el proyecto completo.

El profesor puede pedir:

- Explicar cualquier módulo.
- Justificar decisiones.
- Localizar código.
- Modificar pequeños fragmentos.
- Ejecutar operaciones.
- Demostrar funcionalidades.

Preparar especialmente:

- [ ] Arquitectura.
- [ ] Frontend.
- [ ] JavaScript/DOM.
- [ ] API REST.
- [ ] Backend.
- [ ] MariaDB.
- [ ] Relaciones.
- [ ] Autenticación/sesiones.
- [ ] Roles.
- [ ] CRUD.
- [ ] Matrículas.
- [ ] JSON.
- [ ] Estadísticas.
- [ ] Accesibilidad.
- [ ] Seguridad.

---

# 24. Checklist final

## Funcionalidad

- [ ] Usuarios
- [ ] Cursos
- [ ] Docentes
- [ ] Aulas
- [ ] Matrículas
- [ ] Importación
- [ ] Estadísticas
- [ ] Accesibilidad
- [ ] Seguridad

## Integración

- [ ] Frontend ↔ Backend
- [ ] Backend ↔ MariaDB
- [ ] Fetch/JSON
- [ ] Sesiones
- [ ] Roles

## Calidad

- [ ] Responsive
- [ ] Accesible
- [ ] Homogéneo
- [ ] Modular
- [ ] Sin errores críticos
- [ ] Mensajes claros
- [ ] Código defendible

## Documentación y entrega

- [ ] README actualizado
- [ ] Manual de instalación
- [ ] Manual de usuario
- [ ] SQL
- [ ] JSON
- [ ] Recursos
- [ ] ZIP correcto
- [ ] Prueba desde cero
- [ ] Defensa preparada

---

# 25. Criterio de finalización

Una funcionalidad solo se considera terminada cuando está:

```text
Implementada
    ↓
Validada
    ↓
Integrada
    ↓
Probada
    ↓
Compatible con las reglas de negocio
    ↓
Accesible / responsive cuando corresponda
    ↓
Documentada
    ↓
Defendible
```

**No avanzar acumulando funcionalidades sin comprobar las anteriores.**

---

## 26. Prioridad de desarrollo

```text
1. Requisitos obligatorios
        ↓
2. Integración frontend/backend/BD
        ↓
3. Reglas de negocio y seguridad
        ↓
4. Corrección de errores
        ↓
5. Responsive y usabilidad
        ↓
6. Accesibilidad
        ↓
7. Calidad y refactorización
        ↓
8. Mejoras y ampliaciones
```

La especificación valora la calidad global y una solución coherente, correctamente integrada y defendible por encima de acumular funcionalidades incompletas.