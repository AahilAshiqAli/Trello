import { useTaskStore } from '@/store/useTask';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function TaskCard({
  text,
  id,
  column,
}: {
  text: string;
  id: number;
  column: 'todo' | 'doing' | 'done';
}) {
  const { tasks, deleteTask, editTask } = useTaskStore();

  // 📝 State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  // 📝 Track edited text
  const [editedText, setEditedText] = useState(text);

  const handleEditTask = () => {
    if (editedText.trim() !== '') {
      const editedTask = editTask(column, id, editedText);
      console.log('After edit:', tasks);
      editMutation.mutate(editedTask);
      setIsEditing(false);
    }
  };

  const handleDeleteTask = () => {
    deleteTask(column, id);
    deleteMutation.mutate(id);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, text, column }));
  };
  const queryClient = useQueryClient();
  const editMutation = useMutation({
    mutationFn: async (task) => {
      const response = await fetch('http://localhost:5000/api/tasks/', {
        method: 'PUT',
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

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Refetch tasks from API
    },
  });

  return (
    <div
      className="group flex h-10 w-full items-center rounded-lg bg-white px-3 text-sm text-black shadow-sm transition-all hover:justify-between hover:border-2 hover:border-blue-500"
      draggable
      onDragStart={handleDragStart}
    >
      {isEditing ? (
        // 📝 Editable input field
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="flex-1 border-b focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleEditTask();
            if (e.key === 'Escape') setIsEditing(false);
          }}
        />
      ) : (
        <div className="flex items-center gap-2">
          {/* Hidden Checkbox */}
          <input type="checkbox" id={text} className="peer hidden" />

          {/* Clickable Area for Checkbox */}
          <label
            htmlFor={text}
            className="mr-2 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-400 transition-all group-hover:flex peer-checked:flex peer-checked:border-green-500 peer-checked:bg-green-500"
          >
            {/* Checkmark Icon (Only Visible When Checked) */}
            <i className="fa fa-check hidden text-white peer-checked:block"></i>
          </label>

          {/* Task Text (Moves on Hover) */}
          <span className="transition-all group-hover:pl-6">{text}</span>
        </div>
      )}

      {!isEditing && (
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 hidden rounded bg-yellow-500 p-1 text-white transition-all hover:bg-yellow-600 group-hover:block"
          >
            <i className="fa fa-pencil w-5"></i>
          </button>
          <button
            onClick={handleDeleteTask}
            className="ml-2 hidden rounded bg-red-500 p-1 text-white transition-all hover:bg-red-600 group-hover:block"
          >
            <i className="fa fa-times w-5"></i>
          </button>
        </div>
      )}
    </div>
  );
}
