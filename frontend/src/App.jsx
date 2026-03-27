import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import EditTaskPage from "./pages/EditTaskPage";

export default function App() {
  return (<ThemeProvider><Router><Routes><Route path="/" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} />
          <Route path="/tasks" element={<TasksPage />} /><Route path="/tasks/edit/:id" element={<EditTaskPage />} /></Routes></Router></ThemeProvider>);
}
