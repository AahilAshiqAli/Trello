import { TaskCard } from '@/components/taskCard';
import { useEditTask } from '@/mutations/useEditTask';
import { useTaskStore } from '@/store/useTask';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface Task {
  id: number;
  text: string;
  type: 'todo' | 'doing' | 'done';
}

export function BoardColumn({
  title,
  column,
}: {
  title: string;
  column: 'todo' | 'doing' | 'done';
}) {
  const { tasks, addTask, deleteTask } = useTaskStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const editMutation = useEditTask();

  console.log(tasks);

  const handleAddTask = () => {
    if (newTaskText.trim() !== '') {
      const newTask = addTask(column, newTaskText);
      // here I will implement the logic to add the task to the database
      console.log('New task:', newTask);
      mutation.mutate(newTask);
      setNewTaskText(''); // Reset input field
      setIsAdding(false); // Hide input
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Explicitly asserting the type after JSON parsing
    const taskData = JSON.parse(e.dataTransfer.getData('text/plain')) as {
      id: string;
      text: string;
      column: string;
    };

    if (['todo', 'doing', 'done'].includes(taskData.column)) {
      const typedColumn = taskData.column as 'todo' | 'doing' | 'done';

      if (typedColumn !== column) {
        console.log('Deleting task1111111111111:', taskData);
        deleteTask(typedColumn, Number(taskData?.id));
        const newTask: Task = {
          id: Number(taskData?.id), // Use the existing task's ID
          text: taskData.text,
          type: column,
        };
        addTask(column, newTask.text);
        console.log('New task:', newTask);

        if (typeof newTask === 'object' && newTask !== null) {
          editMutation.mutate(newTask);
        }
      } // ✅ Closing brace added here
    } else {
      console.error('Invalid column type:', taskData.column);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (task) => {
      const response = await fetch('http://localhost:5000/api/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Failed to add task');
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Refetch tasks from API
    },
  });

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
        {tasks[column].map((task) => (
          <TaskCard key={task.id} text={task.text} id={task.id} column={'todo'} />
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
