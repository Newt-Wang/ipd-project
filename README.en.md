# IPD Project - Task Management System

A task management application built with Node.js + Express backend and React + Vite frontend.

## Project Overview

This is a full-stack task management application supporting user registration, login, and full CRUD operations for tasks. The frontend is built with modern React + Vite + Tailwind CSS, while the backend uses the Express framework and MySQL database.

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (mysql2)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Middleware**: CORS, body-parser

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router

## Project Structure

```
ipd-project/
├── backend/
│   ├── config.js           # Configuration file
│   ├── db.js               # Database connection
│   ├── server.js           # Server entry point
│   ├── controllers/        # Controllers
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/         # Middleware
│   │   └── authMiddleware.js
│   ├── routes/             # Routes
│   │   ├── auth.js
│   │   └── tasks.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/          # Page components
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── TasksPage.jsx
    │   │   ├── EditTaskPage.jsx
    │   │   └── ForgotPasswordPage.jsx
    │   ├── components/     # Shared components
    │   │   └── TaskCard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## Features

- ✅ User registration and login
- ✅ JWT authentication
- ✅ Task creation, reading, updating, and deletion
- ✅ Task priority settings (High/Medium/Low)
- ✅ Task status management (In Progress/Completed)
- ✅ Responsive UI design

## Quick Start

### Prerequisites

- Node.js (v14+)
- MySQL database

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ipd-project
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure the database**
   
   Update the database connection details in `backend/config.js`:
   ```javascript
   module.exports = {
     host: 'localhost',
     user: 'your_db_user',
     password: 'your_db_password',
     database: 'your_db_name'
   };
   ```

4. **Start the backend server**
   ```bash
   npm start
   # or in development mode
   node server.js
   ```

5. **Install frontend dependencies** (in a new terminal)
   ```bash
   cd frontend
   npm install
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST   | `/api/auth/register` | User registration |
| POST   | `/api/auth/login` | User login |

### Task Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET    | `/api/tasks` | Retrieve all tasks |
| POST   | `/api/tasks` | Create a new task |
| PUT    | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Environment Variables

### Backend (.env)
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=taskmanager
JWT_SECRET=your_secret_key
```

## Development Notes

- Backend runs at `http://localhost:3000`
- Frontend runs at `http://localhost:5173` by default
- Frontend is configured with a CORS proxy to handle cross-origin requests

## License

MIT License