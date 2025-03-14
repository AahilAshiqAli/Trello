import { BoardColumn } from '@/components/boardColumn';
import useTasks from '@/hooks/useTasks';
import { createFileRoute } from '@tanstack/react-router';

// interface Task {
//   id: number;
//   text: string;
//   type: 'todo' | 'doing' | 'done';
// }

// ensureQueryData is an asynchronous function that can be used to get an
// existing query's cached data. If the query does not exist, queryClient.fetchQuery will be called and its results returned.
export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  useTasks();

  return (
    <div className="bg-primary text-secondary font-body h-screen w-screen p-0">
      {/* Board Header */}
      <div className="bg-primary-100 font-heading flex items-center justify-between rounded-lg p-3 text-white">
        <h1 className="text-xl font-bold">Aahil Board</h1>
        <div className="flex space-x-4">
          <button className="bg-primary-200 rounded px-4 py-2">Board</button>
          <button className="bg-primary-200 rounded px-4 py-2">Table</button>
        </div>
      </div>

      {/* Board Columns */}
      <div className="mt-6 flex items-start space-x-4 overflow-auto px-4">
        <BoardColumn title="To do" column="todo" />
        <BoardColumn title="Doing" column="doing" />
        <BoardColumn title="Done" column="done" />
      </div>
    </div>
  );
}
