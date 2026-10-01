# Vamos Pues · Encuentra tu próximo parche

Plataforma para descubrir planes, lugares y eventos en Medellín y el Valle de Aburrá según presupuesto, categoría y ubicación.

## Estructura

```
VAMOSPUES/
├── vamos-pues-backend/    API REST en Java 26 + Spring Boot 4 (JPA, H2, Spring Security + JWT)
├── vamos-pues-frontend/   Interfaz en React 19 + Vite (react-router, axios, react-leaflet)
└── iniciar_vamos_pues.bat Arranca backend y frontend y abre el navegador
```

### Backend (`vamos-pues-backend/src/main/java/com/example/VamosPues`)

| Paquete      | Contenido |
|--------------|-----------|
| `model`      | Entidades JPA: `Lugar`, `Categoria`, `Sugerencia`, `Encuesta` |
| `repository` | Repositorios Spring Data |
| `service`    | Lógica: lugares, categorías, sugerencias, encuestas, generador "¿Qué hago hoy?", respaldo JSON, login admin |
| `controller` | Endpoints REST bajo `/api` |
| `dto`        | Objetos de entrada/salida con validaciones |
| `security`   | Configuración de seguridad, filtro y servicio JWT |
| `exception`  | Manejo global de errores (`{ codigoEstado, mensaje, marcaDeTiempo }`) |
| `config`     | Carga inicial de los 129 lugares y 8 categorías (`resources/datos/*.json`) |

La base de datos es **H2 embebida** (archivo `vamos-pues-backend/data/vamospues.mv.db`): no hay que instalar nada. Se crea y se llena sola la primera vez que arranca el backend.

### Frontend (`vamos-pues-frontend/src`)

| Carpeta      | Contenido |
|--------------|-----------|
| `pages`      | Inicio, Explorar, Generador, Mapa, Sugerir, Admin |
| `components` | Header, cinta de estadísticas, footer, tarjeta de lugar, modales, pestañas del panel admin |
| `context`    | Estado global (lugares, categorías, filtros, ficha abierta) |
| `services`   | Cliente HTTP (`api.js`) |
| `utils`      | Constantes, filtros y utilidades del mapa |
| `styles`     | Hoja de estilos oficial de Vamos Pues |

## Cómo ejecutarlo

Requisitos: **Java 21 o superior** y **Node.js 20+** (Maven no hace falta, viene el wrapper `mvnw`).

**Opción rápida:** doble clic en `iniciar_vamos_pues.bat`.

**Manual:**

```bash
# Terminal 1 - backend (http://localhost:8086)
cd vamos-pues-backend
mvnw.cmd spring-boot:run

# Terminal 2 - frontend (http://localhost:5173)
cd vamos-pues-frontend
npm install
npm run dev
```

## Panel de administración

Entrar por el candado 🔐 con la clave **`vamospues2026`** (se cambia con la variable de entorno `ADMIN_CLAVE`).

## API principal

| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/api/lugares`, `/api/lugares/{id}` | Público |
| GET | `/api/lugares/generar?presupuesto=&categoria=&incluirMayoresDeEdad=` | Público |
| GET | `/api/categorias` | Público |
| POST | `/api/sugerencias`, `/api/encuestas` | Público |
| POST | `/api/admin/login` | Público |
| POST/PUT/DELETE | `/api/lugares` | Admin |
| POST | `/api/categorias` | Admin |
| GET / PUT | `/api/sugerencias`, `/api/sugerencias/{id}/aprobar`, `/rechazar` | Admin |
| GET | `/api/encuestas` | Admin |
| GET / POST | `/api/admin/respaldo`, POST `/api/admin/restablecer` | Admin |
