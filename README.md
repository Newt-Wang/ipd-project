

# IPD Project - 任务管理系统

一个基于 Node.js + Express 后端和 React + Vite 前端构建的任务管理应用。

## 项目简介

这是一个完整的全栈任务管理应用程序，支持用户注册、登录、任务 CRUD 操作。前端采用现代化的 React + Vite + Tailwind CSS 构建，后端使用 Express 框架和 MySQL 数据库。

## 技术栈

### 后端
- **Runtime**: Node.js
- **框架**: Express.js
- **数据库**: MySQL (mysql2)
- **认证**: JWT (jsonwebtoken) + bcryptjs
- **中间件**: CORS, body-parser

### 前端
- **框架**: React 18
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **路由**: React Router

## 项目结构

```
ipd-project/
├── backend/
│   ├── config.js           # 配置文件
│   ├── db.js               # 数据库连接
│   ├── server.js           # 服务器入口
│   ├── controllers/        # 控制器
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/          # 中间件
│   │   └── authMiddleware.js
│   ├── routes/             # 路由
│   │   ├── auth.js
│   │   └── tasks.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/          # 页面组件
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── TasksPage.jsx
    │   │   ├── EditTaskPage.jsx
    │   │   └── ForgotPasswordPage.jsx
    │   ├── components/      # 公共组件
    │   │   └── TaskCard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 功能特性

- ✅ 用户注册与登录
- ✅ JWT 身份验证
- ✅ 任务创建、读取、更新、删除
- ✅ 任务优先级设置（高/中/低）
- ✅ 任务状态管理（进行中/已完成）
- ✅ 响应式 UI 设计

## 快速开始

### 前置要求

- Node.js (v14+)
- MySQL 数据库

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd ipd-project
   ```

2. **安装后端依赖**
   ```bash
   cd backend
   npm install
   ```

3. **配置数据库**
   
   在 `backend/config.js` 中配置数据库连接信息：
   ```javascript
   module.exports = {
     host: 'localhost',
     user: 'your_db_user',
     password: 'your_db_password',
     database: 'your_db_name'
   };
   ```

4. **启动后端服务**
   ```bash
   npm start
   # 或开发模式
   node server.js
   ```

5. **安装前端依赖**（新终端）
   ```bash
   cd frontend
   npm install
   ```

6. **启动前端开发服务器**
   ```bash
   npm run dev
   ```

7. **访问应用**
   
   打开浏览器访问 `http://localhost:5173`

## API 端点

### 认证接口
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |

### 任务接口
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/tasks` | 获取所有任务 |
| POST | `/api/tasks` | 创建新任务 |
| PUT | `/api/tasks/:id` | 更新任务 |
| DELETE | `/api/tasks/:id` | 删除任务 |

## 环境变量

### 后端 (.env)
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=taskmanager
JWT_SECRET=your_secret_key
```

## 开发说明

- 后端运行在 `http://localhost:3000`
- 前端默认运行在 `http://localhost:5173`
- 前端已配置 CORS 代理以解决跨域问题

## 许可证

MIT License