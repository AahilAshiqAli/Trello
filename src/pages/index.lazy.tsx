import { BoardColumn } from '@/components/boardColumn';
import useTasks from '@/hooks/useTasks';
import { createLazyFileRoute } from '@tanstack/react-router';

interface Column {
  id: 'todo' | 'doing' | 'done';
  title: string;
}

const initialColumns: Column[] = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
];

export const Route = createLazyFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  useTasks();

  return (
    <div className="bg-primary text-secondary font-body h-screen w-screen p-0">
      {/* Board Header */}
      <div className="bg-primary-100 font-heading flex items-center justify-between p-3 text-white">
        <h1 className="text-xl font-bold">Aahil Board</h1>
        <div className="flex space-x-4">
          <button className="bg-primary-200 rounded px-4 py-2">Board</button>
          <button className="bg-primary-200 rounded px-4 py-2">Table</button>
        </div>
      </div>

      {/* Board Columns */}
      <div className="mt-6 flex items-start space-x-4 overflow-auto px-4">
        {initialColumns.map((col) => (
          <div
            key={col.id}
            // draggable
            // onDragStart={(e) => handleDragStart(e, col.id)}
            // onDragOver={handleDragOver}
            // onDrop={(e) => handleDrop(e, col.id)}
            className="cursor-move"
          >
            <BoardColumn title={col.title} column={col.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
