# Backend Tests(backend/__tests__/)

## 1. authController.test.js — Unit Test

**Subject:** Authentication controller (login / register)

| Case | Input | Output |
|------|-------|--------|
| Login with non-existent user | username: "test", password: "password", DB returns empty | HTTP 400, "User not found" |
| Register with missing fields | { username: "test" } (no password) | HTTP 400, "Missing fields" |

Uses jest.doMock to mock the database — no real DB access.

---

## 2. authMiddleware.test.js — Unit Test

**Subject:** JWT authentication middleware

| Case | Input | Output |
|------|-------|--------|
| No Authorization header | Empty request headers | HTTP 401, "No token", next() not called |
| Invalid token | Bearer invalidtoken, jwt.verify throws | HTTP 401, "Invalid token" |
| Valid token | Bearer validtoken, jwt.verify returns { id: 1 } | req.user is set, next() is called |

Mocks jsonwebtoken — no dependency on a real secret key.

---

## 3. taskController.test.js — Unit Test (shallow)

**Subject:** Task controller (getTasks / createTask / updateTaskStatus)

Only validates that request parameters are structured as expected — the controller functions are never actually invoked:

- `req.user.id` equals 1
- `req.body.priority` is `undefined` when not provided
- Date formatting: `2024-01-01T12:00:00.000Z` → `"2024-01-01 12:00:00"`

---

## 4. auth.integration.test.js — Integration Test

**Subject:** Real HTTP endpoints via supertest against a real database

| Endpoint | Case | Input | Output |
|----------|------|-------|--------|
| POST /api/auth/register | Successful registration | { username, password } | HTTP 200, "User registered" |
| | Duplicate username | Same username again | HTTP 400, "User already exists" |
| | Missing password | Username only | HTTP 400, "Missing fields" |
| POST /api/auth/login | Successful login | Correct credentials | HTTP 200, returns token |
| | Wrong password | Incorrect password | HTTP 400, "Wrong password" |
| | Non-existent user | Unknown username | HTTP 400, "User not found" |

Automatically cleans up the test user from the database after all tests complete.

---

# Frontend Tests (frontend/src/__tests__/)

## 5. TaskCard.test.jsx — Component Unit Test

**Subject:** TaskCard UI component using React Testing Library

| Case | Input | Output (DOM assertion) |
|------|-------|------------------------|
| Renders title and description | mockTask object | Page contains "Test Task" / "Test Description" |
| Priority badge | priority: "High" | Displays "High" |
| Category badge | category: "Work" | Displays "💼 Work" |
| Card click | Click event | onClick callback is triggered |
| Checkbox click | Click toggle button | onToggleStatus callback is triggered |
| Completed task | completed: true | Title has line-through style |
| Overdue task | due_date set to yesterday | Displays "Overdue" label |
| Status view mode | viewMode="status" | Displays "Pending" |
| Category view mode | viewMode="category" | Displays "Work" |

---

## 6. useSound.test.js — Hook Unit Test

**Subject:** useSound custom hook (Web Audio API wrapper)

| Case | Input | Output |
|------|-------|--------|
| Returns a function | renderHook(() => useSound()) | Return value type is function |
| Plays sound | Calls the returned function | AudioContext is created; oscillator and gain nodes are invoked |
| Handles Audio errors gracefully | AudioContext constructor throws | No exception thrown; console logs "Audio play failed:" |

Fully mocks window.AudioContext — no real audio environment required.

---

## Summary

- **Backend**: 3 unit tests (mock-isolated) and 1 integration test (real DB)
- **Frontend**: 1 component rendering test and 1 hook behavior test, both unit tests


---

---

# Backend 测试（backend/__tests__/）

## 1. authController.test.js — 单元测试

**测试对象：** 认证控制器（login / register）

| 用例 | 输入 | 输出 |
|------|------|------|
| 用户不存在时登录 | username: "test", password: "password"，数据库返回空 | HTTP 400, "User not found" |
| 注册时缺少字段 | { username: "test" }（缺 password） | HTTP 400, "Missing fields" |

使用 jest.doMock mock 数据库，不访问真实 DB。

---

## 2. authMiddleware.test.js — 单元测试

**测试对象：** JWT 认证中间件

| 用例 | 输入 | 输出 |
|------|------|------|
| 无 Authorization 头 | 空请求头 | HTTP 401, "No token"，不调用 next() |
| Token 无效 | Bearer invalidtoken，jwt.verify 抛错 | HTTP 401, "Invalid token" |
| Token 有效 | Bearer validtoken，jwt.verify 返回 { id: 1 } | req.user 被赋值，调用 next() |

mock 了 jsonwebtoken，不依赖真实密钥。

---

## 3. taskController.test.js — 单元测试（浅）

**测试对象：** 任务控制器（getTasks / createTask / updateTaskStatus）

实际只验证了请求参数的结构是否符合预期，并未真正调用控制器函数：

- `req.user.id` 是否为 1
- `req.body.priority` 在未传入时为 `undefined`
- 日期格式化逻辑 `2024-01-01T12:00:00.000Z` → `"2024-01-01 12:00:00"`

---

## 4. auth.integration.test.js — 集成测试

**测试对象：** 真实 HTTP 接口，使用 supertest + 真实数据库

| 接口 | 用例 | 输入 | 输出 |
|------|------|------|------|
| POST /api/auth/register | 正常注册 | { username, password } | HTTP 200, "User registered" |
| | 重复用户名 | 相同用户名 | HTTP 400, "User already exists" |
| | 缺少密码 | 只有 username | HTTP 400, "Missing fields" |
| POST /api/auth/login | 正常登录 | 正确用户名密码 | HTTP 200，返回 token |
| | 密码错误 | 错误密码 | HTTP 400, "Wrong password" |
| | 用户不存在 | 不存在的用户名 | HTTP 400, "User not found" |

测试结束后会自动清理数据库中的测试用户。

---

# Frontend 测试（frontend/src/__tests__/）

## 5. TaskCard.test.jsx — 组件单元测试

**测试对象：** TaskCard UI 组件，使用 React Testing Library

| 用例 | 输入 | 输出（DOM 断言） |
|------|------|----------------|
| 渲染标题和描述 | mockTask 对象 | 页面包含 "Test Task" / "Test Description" |
| 优先级徽章 | priority: "High" | 显示 "High" |
| 分类徽章 | category: "Work" | 显示 "💼 Work" |
| 点击卡片 | 点击事件 | onClick 回调被触发 |
| 点击复选框 | 点击切换按钮 | onToggleStatus 回调被触发 |
| 已完成任务 | completed: true | 标题有 line-through 样式 |
| 过期任务 | due_date 为昨天 | 显示 "Overdue" 标签 |
| status 视图模式 | viewMode="status" | 显示 "Pending" |
| category 视图模式 | viewMode="category" | 显示 "Work" |

---

## 6. useSound.test.js — Hook 单元测试

**测试对象：** useSound 自定义 Hook（Web Audio API 封装）

| 用例 | 输入 | 输出 |
|------|------|------|
| 返回函数 | renderHook(() => useSound()) | 返回值类型为 function |
| 调用播放 | 调用返回的函数 | AudioContext 被创建，oscillator 和 gain 节点被调用 |
| Audio 异常容错 | AudioContext 构造器抛错 | 不抛出异常，控制台打印 "Audio play failed:" |

全程 mock window.AudioContext，不依赖真实音频环境。

---

## 总结

- **Backend**：3 个单元测试（mock 隔离）+ 1 个集成测试（真实 DB）
- **Frontend**：1 个组件渲染测试 + 1 个 Hook 行为测试，均为单元测试

---

# Sample User Test Cases

| ID | Test Case | Sample Data | Steps | Expected Result | Time Spent | User Feedback |
|----|-----------|-------------|-------|-----------------|------------|---------------|
| 1 | New user registration | Email: `emma.tan@example.com`<br>Password: `TaskFlow2026!`<br>Confirm Password: `TaskFlow2026!` | 1. Open the register page.<br>2. Enter valid registration data.<br>3. Click **Create Account**. | Account is created successfully, user is redirected to the login page, and a success message is displayed. | 1 min 20 sec | Registration was easy and the success message was clear. |
| 2 | Login with valid credentials | Email: `emma.tan@example.com`<br>Password: `TaskFlow2026!` | 1. Open the login page.<br>2. Enter valid credentials.<br>3. Click **Sign In**. | User logs in successfully and is redirected to the homepage with live summary cards visible. | 45 sec | Login felt smooth and the loading state was helpful. |
| 3 | Create a high-priority work task | Title: `Finish database report`<br>Description: `Prepare the final analytics summary for Monday's review meeting.`<br>Priority: `High`<br>Category: `Work`<br>Due Date: `2026-05-15 09:00` | 1. Open the tasks page.<br>2. Click the floating **Add Task** button.<br>3. Fill in the task form.<br>4. Click **Add Task**. | The task is added successfully and appears with the correct priority and category. | 2 min 10 sec | The add-task flow was simple, but users may want a bigger date picker on small screens. |
| 4 | Search and sort tasks | Search keyword: `report`<br>Sort option: `Priority` | 1. Open the tasks page.<br>2. Enter `report` in the search field.<br>3. Change sorting to **Priority**. | Only matching tasks are shown, and high-priority matching tasks appear first. | 50 sec | Search was fast and sorting made the results easier to review. |
| 5 | Complete a pending task | Task title: `Finish database report` | 1. Open the tasks page.<br>2. Find the target task.<br>3. Click the status toggle button. | The task changes to completed, completed styling appears, and progress statistics increase. | 35 sec | Completing a task felt intuitive and the visual update was immediate. |
| 6 | View overdue reminder notification | Title: `Pay electricity bill`<br>Due Date: `2026-05-01 18:00`<br>Status: `Pending` | 1. Log in with a user who has an overdue task.<br>2. Open the tasks page.<br>3. Click the notification button. | The overdue reminder panel opens and shows the overdue task details with dismiss and navigation options. | 55 sec | The reminder panel was useful and made overdue items easy to find. 