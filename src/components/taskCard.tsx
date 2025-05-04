import { useDeleteTask } from '@/mutations/useDeleteTask';
import { useEditTask } from '@/mutations/useEditTask';
import { useTaskStore } from '@/store/useTask';
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
  const [isEditing, setIsEditing] = useState(false);
  // 📝 Track edited text
  const [editedText, setEditedText] = useState(text);
  const editMutation = useEditTask();
  const deleteMutation = useDeleteTask();
  const [showModal, setShowModal] = useState(false);

  const handleEditTask = () => {
    if (editedText.trim() !== '') {
      for (const col of ['todo', 'doing', 'done'] as const) {
        if (tasks[col].some((task) => task.id === Number(id))) {
          column = col;
          break;
        }
      }
      const editedTask = editTask(column, id, editedText, column);
      console.log('After edit:', tasks);
      if (typeof editedTask === 'object' && editedTask !== null) {
        console.log('hello');
        editMutation.mutate(editedTask);
        console.log('errorended');
      }
      setIsEditing(false);
    }
  };

  const handleDeleteTask = () => {
    deleteTask(column, id);
    deleteMutation.mutate(id);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, text }));
  };

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
            onClick={() => setShowModal(true)}
            className="ml-2 hidden rounded bg-red-500 p-1 text-white transition-all hover:bg-red-600 group-hover:block"
          >
            <i className="fa fa-times w-5"></i>
          </button>

          {/* Delete Confirmation Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-200/30">
              <div className="rounded bg-white p-4 shadow-md">
                <p className="mb-4">Are you sure you want to delete this task?</p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      handleDeleteTask();
                      setShowModal(false);
                    }}
                    className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
