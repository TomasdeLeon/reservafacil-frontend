# 🏡 ReservaFácil - Aplicación de Reservas

ReservaFácil es una plataforma web desarrollada con **React + Spring Boot** que permite a usuarios:

- Publicar productos o espacios para reservar.
- Filtrar por fechas, categorías y disponibilidad.
- Reservar y dejar reseñas.
- Gestionar favoritos y reservas.
- Administrar usuarios, roles y productos (admin).

---

## 🚀 Tecnologías utilizadas

### Frontend

- React + Vite
- React Router
- Axios
- date-fns
- CSS Modules

### Backend

- Spring Boot
- Spring Data JPA (Hibernate)
- H2 / PostgreSQL
- Spring Mail (para notificaciones)

---

## 🔧 Instalación local

### Requisitos

- Node.js y npm
- Java 17+
- IDE (IntelliJ / VSCode)

### Pasos

1. Clonar el repositorio

```bash
git clone https://github.com/usuario/reservafacil.git
```

2. Iniciar el backend (Spring Boot)

- Cargar proyecto en IntelliJ o VSCode con Spring Boot.
- Configurar base de datos si es necesario.
- Ejecutar la clase `BackendApplication.java`

3. Iniciar frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🎓 Funcionalidades principales

- Registro / login de usuarios.
- Agregar, editar y eliminar productos.
- Visualización detallada por producto.
- Reservas con validación de fechas.
- Historial de reservas y cancelaciones.
- Reseñas con puntaje y comentario.
- Favoritos.
- Administración de usuarios (roles, eliminación).
- Notificación por email en reservas.
- Compartir productos en redes.
- Botón flotante de WhatsApp.

---

## 🔢 Endpoints Backend (resumen)

### Usuarios

- `POST /api/usuarios/login`
- `POST /api/usuarios/registro`
- `GET /api/usuarios`
- `PUT /api/usuarios/{id}/rol`
- `DELETE /api/usuarios/{id}`

### Productos

- `GET /api/productos`
- `GET /api/productos/{id}`
- `POST /api/productos`
- `PUT /api/productos/{id}`
- `DELETE /api/productos/{id}`

### Reservas

- `GET /api/reservas/usuario/{id}`
- `GET /api/reservas/producto/{id}`
- `POST /api/reservas`
- `DELETE /api/reservas/{id}`

### Otros

- `GET /api/categorias`
- `GET /api/caracteristicas`
- `GET /api/favoritos`

---

## 📊 Casos de prueba manuales (QA)

| Caso | Funcionalidad               | Descripción                                            | Pasos a seguir                                     | Resultado esperado                            | Estado |
| ---- | --------------------------- | ------------------------------------------------------ | -------------------------------------------------- | --------------------------------------------- | ------ |
| TC01 | Registro de usuario         | Crear un nuevo usuario desde el formulario de registro | Ir a `/registro`, completar los campos, enviar     | Usuario creado, redirige a login              | ✅      |
| TC02 | Inicio de sesión            | Ingresar con credenciales válidas                      | Ir a `/login`, completar y enviar                  | Usuario autenticado, accede a menú            | ✅      |
| TC03 | Creación de producto        | Agregar un nuevo producto desde el formulario          | Ir a `/producto/nuevo`, completar campos y guardar | Producto aparece en lista                     | ✅      |
| TC04 | Agregar producto sin imagen | Validar creación sin imagen                            | Ingresar datos sin imagen y guardar                | Producto se guarda y muestra con placeholder  | ✅      |
| TC05 | Visualización de detalle    | Ingresar a la vista de detalle de un producto          | Click en un producto desde la lista                | Muestra datos, imagen, calendario             | ✅      |
| TC06 | Validación de fechas        | Validar que no se pueda reservar en fechas pasadas     | Seleccionar fechas inválidas y reservar            | Mensaje de advertencia ⚠️                     | ✅      |
| TC07 | Reserva exitosa             | Reservar en fechas disponibles                         | Seleccionar fechas libres y reservar               | Mensaje de éxito + correo enviado             | ✅      |
| TC08 | Reserva superpuesta         | Intentar reservar en fechas ya ocupadas                | Seleccionar fechas ocupadas y reservar             | Mensaje de error, no guarda                   | ✅      |
| TC09 | Cancelación de reserva      | El usuario cancela una reserva propia                  | Ir a `Mis Reservas`, click en eliminar             | Reserva se borra de la lista                  | ✅      |
| TC10 | Reseña de producto          | Usuario deja una reseña luego de reservar              | Ir al detalle, dejar comentario y puntaje          | Reseña guardada y mostrada                    | ✅      |
| TC11 | Rol admin                   | Ver acceso a página de usuarios como admin             | Login como admin, ir a `/admin/usuarios`           | Lista de usuarios con opción de cambio de rol | ✅      |
| TC12 | Botón WhatsApp flotante     | Visualización del botón flotante en pantalla           | Ingresar a cualquier vista, scroll                 | Botón fijo en esquina inferior                | ✅      |
| TC13 | Envío de correo             | Confirmación por mail al realizar una reserva          | Reservar como usuario válido                       | Llega correo a Gmail con HTML                 | ✅      |
| TC14 | Imagen placeholder          | Producto sin imagen muestra imagen por defecto         | Agregar producto sin URL de imagen                 | Se muestra imagen `no-image.png`              | ✅      |

---

## 📅 Roadmap futuro

- Integración de pasarela de pagos.
- Reportes de actividad por usuario/admin.
- Notificación push y por SMS.
- Mejora de accesibilidad y PWA.

---

## 👤 Autores

- Tomás de León
- Proyecto final

---

© 2025 ReservaFácil. Todos los derechos reservados.

