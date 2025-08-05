import { getDatabase, update, ref, remove } from 'firebase/database';
import { app } from '../firebase';
import { useState } from 'react';
import task from '../images/task.png';
import edit from '../images/edit.png'
import delete_img from '../images/bin.png'

type TaskProps = {
  taskId: string;
  taskName: string;
  taskDesc: string;
  taskPriority: string;
};

const db = getDatabase(app);

type EditMenuProps = {
  taskId: string;
  initialName: string;
  initialDesc: string;
  initialPriority: string;
  onClose: () => void;
  onSave: (updatedData: { taskName: string; taskDesc: string; taskPriority: string }) => void;
};

const delete_task = async (taskId: string) => {
  const confirm = window.confirm("Are you sure you want to delete this task?");
  if (confirm) {
    try {
      const taskRef = ref(db, `task_info/${taskId}`);
      await remove(taskRef);
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  }
};

const EditMenu = ({ initialName, initialDesc, initialPriority, onClose, onSave }: EditMenuProps) => {
  const [taskName, setTaskName] = useState(initialName);
  const [taskDesc, setTaskDesc] = useState(initialDesc);
  const [taskPriority, setTaskPriority] = useState(initialPriority);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !taskPriority) {
      alert("Please fill all required fields");
      return;
    }
    onSave({ taskName, taskDesc, taskPriority });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button 
          type="button" 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition"
        >
          
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Task</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-4"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const editTask = async (taskId: string, updatedData: { taskName: string; taskDesc: string; taskPriority: string }) => {
  try {
    const taskRef = ref(db, `task_info/${taskId}`);
    await update(taskRef, updatedData);
    return true;
  } catch (error) {
    console.error("Firebase error:", error);
    return false;
  }
};

const ChildComponent = ({ taskId, taskName, taskDesc, taskPriority }: TaskProps) => {
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  const handleSave = async (updatedData: { taskName: string; taskDesc: string; taskPriority: string }) => {
    try {
      await editTask(taskId, updatedData);
      setShowEditMenu(false);
      setTasks(tasks.map(task =>
        task.taskId === taskId ? { ...task, ...updatedData } : task
      ));
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const handleDelete = async () => {
    const success = await delete_task(taskId);
    if (success) {
      setTasks(tasks.filter(task => task.taskId !== taskId));
    }
  };

  return (
    <>
      <div
        className={`rounded-xl shadow-sm border border-gray-200 w-full flex p-5 mb-4 ${
          taskPriority === 'High' ? 'border-l-4 border-l-red-500' :
          taskPriority === 'Medium' ? 'border-l-4 border-l-yellow-400' :
          'border-l-4 border-l-green-500'
        }`}
      >
        <div className="flex-shrink-0 mr-4">
          <img src={task} alt="Task" className="h-12 w-12" />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800">{taskName}</h3>
          <p className="text-gray-600 mt-1">{taskDesc}</p>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              taskPriority === 'High' ? 'bg-red-100 text-red-800' :
              taskPriority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {taskPriority} Priority
            </span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setShowEditMenu(true)}
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <img src={edit} alt="Edit" className='w-12' />
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-600 transition-colors p-1"
          >
           <img src={delete_img} alt="Delete" className='w-10' />
          </button>
        </div>
      </div>

      {showEditMenu && (
        <EditMenu
          taskId={taskId}
          initialName={taskName}
          initialDesc={taskDesc}
          initialPriority={taskPriority}
          onClose={() => setShowEditMenu(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default ChildComponent;