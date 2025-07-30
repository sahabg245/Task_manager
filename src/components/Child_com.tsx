
import { getDatabase, update, ref } from 'firebase/database';
import { app } from '../firebase';


type TaskProps = {
    taskId: string;
    taskName: string;
    taskDesc: string;
    taskPriority: string;
};

const db = getDatabase(app);

const edit_task = (
    taskId: string,
    updatedData: { taskName: string; taskDesc: string; taskPriority: string }
) => {
    const taskRef = ref(db, `tasks_info/${taskId}`);
    update(taskRef, updatedData)
        .then(() => {
            console.log('Task updated successfully');
        })
        .catch((error) => {
            console.error('Error updating task: ', error);
        });
};

const Child_com = ({ taskId, taskName, taskDesc, taskPriority }: TaskProps) => {
    return (
        <>
            <div
                className={`rounded shadow-md w-96 flex px-10 py-3 ${taskPriority === 'High'
                        ? 'bg-red-400'
                        : taskPriority === 'Medium'
                            ? 'bg-yellow-300'
                            : 'bg-green-400'
                    }`
            }
            >
                <div className="flex-col">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{taskName}</h1>
                    <h2 className="text-lg text-gray-800">{taskDesc}</h2>
                </div>
                <div className='flex items-end justify-end ml-auto'>
                    <button
                        onClick={() => edit_task(taskId, { taskName, taskDesc, taskPriority })}
                        className="border font-bold h-10 w-20 rounded hover:bg-gray-300 duration-300">
                        Edit
                    </button>
                </div>
            </div>
        </>
    );
};

export default Child_com;
