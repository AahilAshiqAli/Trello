import { TaskCard } from '@/components/taskCard';
import { useCreateTask } from '@/mutations/useCreateTask';
import { useEditTask } from '@/mutations/useEditTask';
import { useTaskStore } from '@/store/useTask';
import { useState } from 'react';

export function BoardColumn({
  title,
  column,
}: {
  title: string;
  column: 'todo' | 'doing' | 'done';
}) {
  const { tasks, addTask, editTask } = useTaskStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const editMutation = useEditTask();
  const mutation = useCreateTask();

  const handleAddTask = () => {
    if (newTaskText.trim() !== '') {
      const newTask = addTask(column, newTaskText);
      // here I will implement the logic to add the task to the database
      console.log('New task:', newTask);
      if (typeof newTask === 'object' && newTask !== null) {
        mutation.mutate(newTask);
      }
      setNewTaskText(''); // Reset input field
      setIsAdding(false); // Hide input
    }
  };

  // Drag and Drop API for moving tasks between columns automatically when dragged uses drag overlay
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Explicitly asserting the type after JSON parsing
    const taskData = JSON.parse(e.dataTransfer.getData('text/plain')) as {
      id: string;
      text: string;
    };

    // current task has task object having 3 arrays
    // 🛠️ Get the latest column dynamically from the Zustand store
    const currentTasks = useTaskStore.getState().tasks;
    let oldColumn: 'todo' | 'doing' | 'done' | null = null;

    for (const col of ['todo', 'doing', 'done'] as const) {
      if (currentTasks[col].some((task) => task.id === Number(taskData.id))) {
        oldColumn = col;
        break;
      }
    }

    if (!oldColumn) {
      console.error('Task not found in any column');
      return;
    }

    const newColumn = column;

    if (oldColumn !== newColumn) {
      console.log(`Moving task from ${oldColumn} to ${newColumn}`);

      // Edit task and move it to new column
      const editedTask = editTask(oldColumn, Number(taskData.id), taskData.text, newColumn);

      if (typeof editedTask === 'object' && editedTask !== null) {
        console.log('Updating database...');
        editMutation.mutate(editedTask);
      }
    } else {
      alert('Task cannot be moved to the same column');
    }
  };

  return (
    <div
      className="w-80 rounded-lg p-4 shadow-md"
      style={{ backgroundColor: '#f1f2f4' }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <div className="flex space-x-3">
          <button className="h-10 w-10 rounded-lg px-2 text-gray-500 transition-all duration-200 hover:bg-gray-300 hover:text-gray-700 hover:shadow-lg">
            <i className="fa fa-shield fa-rotate-90"></i>
          </button>
          <button className="h-10 w-10 rounded-lg px-2 text-gray-500 transition-all duration-200 hover:bg-gray-300 hover:text-gray-700 hover:shadow-lg">
            <i className="fa fa-ellipsis-h"></i>
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks[column].map((task, index) => (
          <TaskCard key={`${task.id}-${index}`} text={task.text} id={task.id} column={'todo'} />
        ))}
      </div>

      {/* Add Task Button */}
      {/* Input Field for New Task */}
      {isAdding ? (
        <div className="mt-2 flex items-center space-x-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="w-full rounded border px-2 py-1 focus:outline-none"
            placeholder="Enter task name..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTask(); // Add task on Enter
              if (e.key === 'Escape') setIsAdding(false); // Cancel on Esc
            }}
          />
          <button onClick={handleAddTask} className="rounded bg-green-500 px-3 py-1 text-white">
            <i className="fa fa-check hidden text-white peer-checked:block"></i>
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="rounded bg-red-400 px-3 py-1 text-white"
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
      ) : (
        <button
          className="text-secondary my-3 w-full rounded-2xl px-3 py-2 text-left font-semibold transition hover:bg-gray-300"
          onClick={() => setIsAdding(true)}
        >
          + Add a card
        </button>
      )}
    </div>
  );
}
