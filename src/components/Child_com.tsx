import { getDatabase, update, ref, remove } from 'firebase/database';
import { app } from '../firebase';
import { useState } from 'react';
import task from '../images/task.png'

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
    const confirm = window.confirm("Are you sure you want to delete this task ?");
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
}

const EditMenu = ({ initialName, initialDesc, initialPriority, onClose, onSave }: EditMenuProps) => {
    const [taskName, setTaskName] = useState(initialName);
    const [taskDesc, setTaskDesc] = useState(initialDesc);
    const [taskPriority, setTaskPriority] = useState(initialPriority);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskName.trim() || !taskPriority) {
            alert("Please fill all required fields");
            return;
        }
        onSave({ taskName, taskDesc, taskPriority });
    };

    return (
        <div className="fixed inset-0 bg-gray-200 flex justify-center items-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-300 h-120 w-120 rounded-xl p-5">
                <div className="fixed flex items-center justify-center ml-95" >
                    <button type="button" onClick={onClose} className='bg-red-600 font-bold text-3xl w-15 rounded'>X</button>
                </div>
                <label className="font-bold text-3xl flex justify-center">
                    Edit Task
                </label>

                <div className="flex-col items-center justify-center p-2">
                    <label
                        htmlFor="add_task"
                        className="font-semibold text-2xl flex justify-center mt-5.5"
                    >
                        Task name
                    </label>
                    <input
                        required
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="border px-2 rounded h-8 ml-28 font-semibold"
                        id="add_task"
                    />
                </div>

                <div className="flex-col items-center justify-center p-2">
                    <label
                        htmlFor="add_desc"
                        className="font-semibold text-2xl flex justify-center mt-5.5"
                    >
                        Task Description
                    </label>
                    <input
                        required
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        className="border px-2 rounded h-8 ml-28 font-semibold"
                        id="add_desc"
                    />
                </div>

                <div className="flex-col items-center justify-center p-2">
                    <label
                        htmlFor="priority"
                        className="font-semibold text-2xl flex justify-center mt-5.5"
                    >
                        Task Priority:
                    </label>
                    <select
                        required
                        id="priority"
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className="border px-2 rounded h-8 ml-28 font-semibold w-53"
                    >
                        <option value="">-- Select Priority --</option>
                        <option value="High">🔴 High</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="Low">🟢 Low</option>
                    </select>
                </div>

                <button type="submit"
                    className="font-semibold p-1.5 border rounded-sm bg-blue-400 ml-45 mt-8 w-22 hover:bg-blue-600 duration-300">
                    Edit Task
                </button>
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
                className={`rounded  shadow-md w-200 flex px-6 py-5 ${taskPriority === 'High'
                        ? 'bg-red-400'
                        : taskPriority === 'Medium'
                            ? 'bg-yellow-300'
                            : 'bg-green-400'
                    }`}
            >
                <div className='h-20 w-20 p-3 flex space-x-2' >
                    <img src={task} alt="Task Image" />
                </div>
                <div className="flex-col flex-grow p-1 ml-5" >
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{taskName}</h1>
                    <h2 className="text-lg text-gray-800">{taskDesc}</h2>
                </div>
                <div className='flex-col space-y-2'>
                    <button
                        onClick={() => setShowEditMenu(true)}
                        className="border font-bold h-10 w-20 rounded hover:bg-white duration-300">
                        Edit
                    </button>
                    <div className='flex'>
                        <button
                            onClick={handleDelete}
                            className="border font-bold h-10 w-20 rounded hover:bg-white duration-300">
                            Delete
                        </button>
                    </div>
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