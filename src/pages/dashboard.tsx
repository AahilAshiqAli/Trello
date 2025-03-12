import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
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
      <div className="mt-6 flex space-x-4 overflow-auto px-4">
        {/* To Do Column */}
        <BoardColumn title="To do">
          <TaskCard text="Complete Project Trello" />
          <TaskCard text="Start Planning" />
        </BoardColumn>

        {/* Doing Column */}
        <BoardColumn title="Doing">
          <button className="text-gray-500">+ Add a card</button>
        </BoardColumn>

        {/* Done Column */}
        <BoardColumn title="Done">
          <button className="text-gray-500">+ Add a card</button>
        </BoardColumn>
      </div>
    </div>
  );
}

// Board Column Component
function BoardColumn({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="w-80 rounded-lg p-4 shadow-md" style={{ backgroundColor: '#f1f2f4' }}>
      <h2 className="mb-3 font-bold">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function TaskCard({ text }: { text: string }) {
  return (
    <div className="group flex h-10 w-full items-center rounded-lg bg-white px-3 text-sm text-black shadow-sm transition-all hover:border-2 hover:border-blue-500">
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
  );
}

// function TaskCard({ text }: { text: string }) {
//   return (
//     <div className="font-body group flex h-10 w-full items-center rounded-lg bg-white px-3 text-sm text-black shadow-sm transition-all hover:border-2 hover:border-blue-500">
//       {/* Hidden Checkbox */}
//       <input type="checkbox" id={text} className="peer hidden" />

//       {/* Custom Checkbox with FA Check Icon */}
//       <label
//         htmlFor={text}
//         className="mr-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-gray-400 transition-all peer-checked:border-green-500 peer-checked:bg-green-500"
//       >
//         {/* Font Awesome Check Circle (Hidden Initially, Appears When Checked) */}
//         <i className="fa fa-check text-white peer-checked:hidden"></i>
//       </label>

//       {/* Task Text */}
//       <span className="transition-all group-hover:pl-2">{text}</span>
//     </div>
//   );
// }
