# Proyecto Centros de Salud - Backend (Flask) + Frontend (React)

Este proyecto implementa un sistema completo con backend en Flask (Python) y frontend en React (Vite).

---

## 🚀 Requisitos Previos

- **Python 3.9+**
- **Node.js 18+ y npm**
- **PostgreSQL**
- **pipenv** (`pip install pipenv`)

---

## 📦 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/DorianAndrea/proyecto_centros_v1_postgresql.git
cd proyecto_centros_v1_postgresql
```

---

## ⚙️ Backend - Flask

### 📁 Ir a la carpeta raíz del proyecto:

```bash
cd proyecto_centros_v1_postgresql
```

### 🐍 Crear entorno virtual e instalar dependencias

```bash
pipenv install
pipenv shell
pip install -r requirements.txt  # si estás usando este método
```

> Si usas `pipenv`, también puedes instalar así:
```bash
pipenv install flask flask-cors psycopg2-binary flask-bcrypt
```

### 🔌 Configurar base de datos PostgreSQL

Asegúrate de tener una base de datos creada. Ajusta tus credenciales en:

```
flask_app/config/connectToProgreSql.py
```

### ▶️ Ejecutar backend

```bash
python3 server.py
```

> Por defecto corre en: `http://localhost:5000`

---

## 💻 Frontend - React

### 📁 Ir a la carpeta del frontend

```bash
cd client/centros_salud
```

### 📦 Instalar dependencias

```bash
npm install
```

### ▶️ Ejecutar el frontend

```bash
npm run dev
```

> Por defecto corre en: `http://localhost:3000`

---

## 🔗 Conexión Frontend - Backend

Asegúrate de que tus llamadas `fetch` o `axios` en React usen la URL del backend correctamente, por ejemplo:

```js
fetch("http://localhost:5000/api/centers")
```

---

## ✅ Estructura del proyecto

```
proyecto_centros_v1_postgresql/
│
├── flask_app/             # Lógica y rutas del backend
├── server.py              # Archivo de arranque Flask
├── client/centros_salud/  # Proyecto React con Vite
├── .venv/                 # Entorno virtual (ignorado)
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🧪 Comandos útiles

```bash
# Salir del entorno virtual
exit

# Reinstalar todo desde cero
rm -rf node_modules package-lock.json .venv
pipenv install
npm install
```

---

## 📄 Licencia

MIT ©DorianDonoso
