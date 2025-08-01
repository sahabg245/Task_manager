import React, { useEffect, useState } from 'react';
import { app } from '../firebase'
import { getDatabase, ref, set, push, onValue } from 'firebase/database';
import Child_com from './Child_com';



type PopUpProps = {
    taskName: string;
    setTaskName: any;
    taskDesc: string;
    setTaskDesc: any;
    taskPriority: string;
    setTaskPriority: any;
    showModal: any;
    setModal: any;
};

const Pop_Up = ({ taskName, setTaskName, taskDesc, setTaskDesc, taskPriority, setTaskPriority, setModal }: PopUpProps) => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!taskName || !taskDesc || !taskPriority) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const db = getDatabase(app);
            const dataRef = push(ref(db, "task_info"));
            await set(dataRef, {
                taskName,
                taskDesc,
                taskPriority
            })

            alert("Task added successfully!");
            setTaskName("");
            setTaskDesc("");
            setTaskPriority("");

            setModal(false);
        } catch (error: any) {
            alert("Error" + error.message)
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-200 flex justify-center items-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-300 h-120 w-120 rounded-xl p-5">
                <div className="fixed flex items-center justify-center ml-95" >
                    <button type="button" onClick={() => setModal(false)} className='bg-red-600 font-bold text-3xl w-15 rounded'>X</button>
                </div>
                <label className="font-bold text-3xl flex justify-center">
                    Add new Task
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
                    Add Task
                </button>
            </form>
        </div>
    );
};
const Modal = () => {
    const [showModal, setModal] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskPriority, setTaskPriority] = useState("");
    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        const db = getDatabase(app);
        const taskRef = ref(db, 'task_info');

        onValue(taskRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const taskArray = Object.entries(data).map(([id, value]: any) => ({
                    id,
                    ...value,
                }));
                setTasks(taskArray);
            } else {
                setTasks([]);
            }
        });
    }, []);

    return (
        <>
            <div className='h-screen w-screen p-10 bg-gray-800'>
                <h1 className=' text-white text-4xl font-bold flex justify-center mb-10'>
                    Welcome to Task Manager app
                </h1>
                <div className='flex flex-col items-center gap-4'>
                    {tasks.map(task => (
                        <Child_com taskId={task.id} taskName={task.taskName} taskDesc={task.taskDesc} taskPriority={task.taskPriority}
                        />
                    ))}
                </div>
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={() => {
                            if (showModal) {
                                setTaskName("");
                                setTaskDesc("");
                                setTaskPriority("");
                            }
                            setModal(prev => !prev);
                        }}
                        className='font-bold p-3 border-2 rounded-2xl text-2xl w-15 bg-orange-300 hover:bg-orange-400 duration-200'
                    >
                        +
                    </button>

                    {showModal && (
                        <Pop_Up
                            taskName={taskName}
                            setTaskName={setTaskName}
                            taskDesc={taskDesc}
                            setTaskDesc={setTaskDesc}
                            taskPriority={taskPriority}
                            setTaskPriority={setTaskPriority}
                            showModal={showModal}
                            setModal={setModal}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Modal;
