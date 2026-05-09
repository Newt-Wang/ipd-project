# Project Task Manager

Project Task Manager is a full-stack task management application built with **Node.js + Express + MySQL** on the backend and **React + Vite + Tailwind CSS** on the frontend.

The current version supports authentication, full task CRUD, task status updates, overdue reminders, multiple task views, a live dashboard homepage, task search and sorting, dark mode, and improved login/register flows.

---

## Overview

This project is designed as a personal task management system where users can:

- register and log in
- create, edit, delete, and complete tasks
- organize tasks by priority, category, and due date
- view tasks in multiple filtered layouts
- monitor overdue work and progress from the homepage

It is suitable for coursework, portfolio use, and full-stack practice.

---

## Recent Updates

### Homepage live overview
- The homepage now loads real task data from `/api/tasks`
- Displays:
  - total tasks
  - pending tasks
  - completed tasks
  - overdue tasks
  - tasks due today
  - completion rate
  - next upcoming task
- Includes refresh and quick navigation actions

### Tasks page improvements
- Added **keyword search** across title, description, category, and priority
- Added **sorting** options:
  - default order
  - due date ascending
  - due date descending
  - priority
  - title A-Z
- Added **Clear filters** action
- Shows the number of visible results
- Keeps both timeline and dual-column task views

### Login and register UX improvements
- Login page now supports:
  - show/hide password
  - submitting state
  - duplicate-submit protection
  - inline error messages
  - success message after registration
- Register page now supports:
  - show/hide password fields
  - live password mismatch feedback
  - submitting state
  - duplicate-submit protection
  - friendlier inline error handling

---

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL (`mysql2`)
- **Authentication:** JWT (`jsonwebtoken`) + `bcryptjs`
- **Module system:** ES Modules
- **Testing:** Jest + Supertest

### Frontend
- **Framework:** React 19
- **Build tool:** Vite 7
- **Routing:** React Router 6
- **Styling:** Tailwind CSS + custom CSS
- **Testing:** Jest + Testing Library

---

## Core Features

### Authentication
- User registration
- User login
- JWT-based protected API access
- Client-side token persistence via `localStorage`

### Task Management
- Create tasks
- Read all tasks
- Edit tasks
- Delete tasks
- Toggle task completion status
- Set priority: `High`, `Medium`, `Low`
- Set category: `Work`, `Study`, `Life`
- Set due date and time

### Task Views and Productivity Features
- Homepage live overview
- All tasks view
- Status filter
- Category filter
- Date timeline view
- Keyword search
- Multiple sorting modes
- One-click clear filters

### UI and Experience
- Overdue reminders panel
- Dark / light theme toggle
- Click sound interactions
- Responsive card-based layout

---

## Project Structure

```text
ProjectTaskManager/
├── backend/
│   ├── config.js                 # Database and JWT configuration
│   ├── db.js                     # MySQL connection pool
│   ├── server.js                 # Backend entry, runs on port 4000
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── __tests__/
│   │   └── auth.integration.test.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TaskCard.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useSound.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   └── EditTaskPage.jsx
│   │   ├── __tests__/
│   │   │   ├── TaskCard.test.jsx
│   │   │   └── useSound.test.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── setupTests.js
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Application Routes

### `/`
Login page

### `/register`
Register page

### `/home`
Homepage dashboard with live task statistics and quick actions

### `/tasks`
Main task page with:
- all tasks view
- status filters
- category filters
- date timeline view
- search, sorting, and clear filters
- floating add button
- overdue notifications panel

### `/tasks/edit/:id`
Task edit page

---

## API Endpoints

Backend base URL:

```text
http://localhost:4000
```

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |

### Tasks

> All task endpoints require a Bearer token.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | Get all tasks for the current user |
| GET | `/api/tasks/notifications` | Get overdue task reminders |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PUT | `/api/tasks/:id/status` | Toggle task completion status |
| DELETE | `/api/tasks/:id` | Delete a task |

### Authorization Header Example

```http
Authorization: Bearer <your_token>
```

---

## Local Setup

### Requirements
- Node.js 18+ recommended
- MySQL 8+
- npm

### 1. Clone the repository

```bash
git clone <repository-url>
cd ProjectTaskManager
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure database and JWT settings

Update `backend/config.js`:

```js
export default {
  db: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'your_password',
    database: 'task_manager'
  },
  jwtSecret: 'your_secret_key'
};
```

> Before running the project, make sure to replace the default database credentials and JWT secret.

### 4. Start the backend server

```bash
npm start
```

Backend runs at:

```text
http://localhost:4000
```

### 5. Install frontend dependencies

Open a new terminal and run:

```bash
cd frontend
npm install
```

### 6. Start the frontend development server

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Build and Test

### Frontend development

```bash
cd frontend
npm run dev
```

### Frontend production build

```bash
cd frontend
npm run build
```

### Frontend tests

```bash
cd frontend
npm test
```

### Backend tests

```bash
cd backend
npm test
```

---

## Development Notes

- The frontend directly calls `http://localhost:4000/api/...`
- JWT tokens are stored in `localStorage` after login
- The homepage and tasks page both render dynamic data from the backend
- The project already includes frontend and backend test setup
- Good next extensions for this project include:
  - task tags
  - pagination or virtualization for larger task lists
  - user profile settings
  - stronger form validation
  - broader unit and integration test coverage

---

## Use Cases

This project works well for:

- a full-stack course project
- React + Express practice
- JWT authentication demos
- a task management product prototype
- a portfolio-ready medium-sized project

---

## License

MIT
