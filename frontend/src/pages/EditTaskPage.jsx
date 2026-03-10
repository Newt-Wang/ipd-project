import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [task, setTask] = useState({
    title: "",
    notes: "",
    due: "",
    priority: "Medium",
    category: "Study",
  });

  // 获取现有任务信息
  useEffect(() => {
    fetch(`http://localhost:4000/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((list) => {
        const found = list.find((t) => t.id === Number(id));
        if (found) {
          setTask({
            title: found.title,
            notes: found.description || "",
            due: found.due_date || "",
            priority: found.priority || "Medium",
            category: found.category || "Study",
          });
        }
      });
  }, [id]);

  // 保存修改
  const saveTask = () => {
    fetch(`http://localhost:4000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    }).then(() => navigate("/tasks"));
  };

  // 删除任务
  const deleteTask = () => {
    fetch(`http://localhost:4000/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => navigate("/tasks"));
  };

  return (
    <div className="px-6 pt-8 pb-20">
      {/* 顶部 */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-lg">
          Cancel
        </button>
        <button
          onClick={saveTask}
          className="text-blue-500 font-semibold text-lg"
        >
          Save
        </button>
      </div>

      {/* 输入框 */}
      <div className="space-y-4">
        <input
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          placeholder="Task title"
          className="w-full border px-4 py-3 rounded-xl"
        />

        <textarea
          value={task.notes}
          onChange={(e) => setTask({ ...task, notes: e.target.value })}
          placeholder="Notes (optional)"
          className="w-full border px-4 py-3 rounded-xl h-24"
        />

        {/* 其他字段（Due date / Priority / Category） */}
        <div>
          <label className="font-medium">Due date</label>
          <input
            type="datetime-local"
            value={task.due}
            onChange={(e) => setTask({ ...task, due: e.target.value })}
            className="w-full border mt-2 px-4 py-3 rounded-xl"
          />
        </div>

        <div>
          <label className="font-medium">Priority</label>
          <select
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
            className="w-full border mt-2 px-4 py-3 rounded-xl"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Category</label>
          <select
            value={task.category}
            onChange={(e) => setTask({ ...task, category: e.target.value })}
            className="w-full border mt-2 px-4 py-3 rounded-xl"
          >
            <option>Work</option>
            <option>Study</option>
            <option>Life</option>
          </select>
        </div>
      </div>

      {/* 删除按钮 */}
      <button
        onClick={deleteTask}
        className="w-full mt-10 bg-red-500 text-white py-3 rounded-xl text-lg"
      >
        Delete Task
      </button>
    </div>
  );
}
