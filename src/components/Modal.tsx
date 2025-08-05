import React, { useEffect, useState } from 'react';
import { app } from '../firebase';
import { getDatabase, ref, set, push, onValue } from 'firebase/database';
import Child_com from './Child_com';

type Task = {
  id: string;
  taskName: string;
  taskDesc: string;
  taskPriority: string;
};

const TaskModal = ({ 
  showModal, 
  setModal,
  taskName,
  setTaskName,
  taskDesc,
  setTaskDesc,
  taskPriority,
  setTaskPriority,
  handleSubmit
}: {
  showModal: boolean;
  setModal: (show: boolean) => void;
  taskName: string;
  setTaskName: (name: string) => void;
  taskDesc: string;
  setTaskDesc: (desc: string) => void;
  taskPriority: string;
  setTaskPriority: (priority: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-white/20 overflow-hidden animate-slideUp">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
            <button 
              onClick={() => setModal(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Name
              </label>
              <input
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter task name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
 <input
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter task Description"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-2">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition"
                required
              >
                <option value="">Select Priority</option>
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r bg-blue-400 hover:bg-blue-600 duration-300 text-white font-semibold py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
            >
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const TaskManager = () => {
  const [showModal, setModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const db = getDatabase(app);
    const taskRef = ref(db, 'task_info');

    onValue(taskRef, (snapshot) => {
      const data = snapshot.val();
      const taskArray = data ? Object.entries(data).map(([id, task]: [string, any]) => ({
        id,
        ...task
      })) : [];
      setTasks(taskArray);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const db = getDatabase(app);
      const taskRef = push(ref(db, "task_info"));
      await set(taskRef, { taskName, taskDesc, taskPriority });
      
      setTaskName("");
      setTaskDesc("");
      setTaskPriority("");
      setModal(false);
    } catch (error) {
      alert("Error saving task");
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white p-6">
      <div className="max-w-4xl w-full">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Manager</h1>
        </header>

        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Your Tasks</h2>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r bg-blue-400 hover:bg-blue-600 duration-300 text-white font-medium py-2.5 px-5 rounded-lg transition transform hover:scale-105 shadow-md"
          >
            <span>Add Task</span>
          </button>
        </div>

        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <Child_com
                key={task.id}
                taskId={task.id}
                taskName={task.taskName}
                taskDesc={task.taskDesc}
                taskPriority={task.taskPriority}
              />
            ))
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-1">No tasks yet</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first task</p>
             
            </div>
          )}
        </div>

        <TaskModal
          showModal={showModal}
          setModal={setModal}
          taskName={taskName}
          setTaskName={setTaskName}
          taskDesc={taskDesc}
          setTaskDesc={setTaskDesc}
          taskPriority={taskPriority}
          setTaskPriority={setTaskPriority}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default TaskManager;
