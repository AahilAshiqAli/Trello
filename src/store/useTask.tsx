import { create } from 'zustand';

interface Task {
  id: number;
  text: string;
}

interface TaskType {
  id: number;
  text: string;
  type?: 'todo' | 'doing' | 'done'; // status is optional to handle missing values
}

interface TaskState {
  tasks: {
    todo: Task[];
    doing: Task[];
    done: Task[];
  };
  initializeTasks: (fetchedTasks: TaskType[]) => void;
  addTask: (column: 'todo' | 'doing' | 'done', text: string) => void;
  deleteTask: (column: 'todo' | 'doing' | 'done', id: number) => void;
  editTask: (
    oldColumn: 'todo' | 'doing' | 'done',
    id: number,
    newText: string,
    newColumn: 'todo' | 'doing' | 'done',
  ) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: {
    todo: [],
    doing: [],
    done: [],
  },

  initializeTasks: (fetchedTasks) => {
    set(() => {
      const todoTasks = fetchedTasks
        .filter((task) => task.type === 'todo')
        .map((task) => ({ id: task.id, text: task.text }));

      const doingTasks = fetchedTasks
        .filter((task) => task.type === 'doing')
        .map((task) => ({ id: task.id, text: task.text }));

      const doneTasks = fetchedTasks
        .filter((task) => task.type === 'done')
        .map((task) => ({ id: task.id, text: task.text }));

      return {
        tasks: {
          todo: todoTasks,
          doing: doingTasks,
          done: doneTasks,
        },
      };
    });
  },
  addTask: (column, text) => {
    const newTask = { id: Date.now(), text, type: column };

    set((state) => ({
      tasks: {
        ...state.tasks,
        [column]: [...state.tasks[column], newTask],
      },
    }));

    return newTask;
  },

  deleteTask: (column, id) => {
    set((state) => ({
      tasks: {
        ...state.tasks,
        [column]: state.tasks[column].filter((task) => task.id !== id),
      },
    }));
  },

  editTask: (oldColumn, id, newText, newColumn) => {
    if (oldColumn === newColumn) {
      set((state) => ({
        tasks: {
          ...state.tasks,
          [oldColumn]: state.tasks[oldColumn].map((task) =>
            task.id === id ? { ...task, text: newText } : task,
          ),
        },
      }));
      return;
    }

    set((state) => {
      const taskToMove = state.tasks[oldColumn].find((task) => task.id === id);

      if (!taskToMove) return state; // Task not found, return unchanged state

      const updatedTask = { ...taskToMove, text: newText, type: newColumn };

      return {
        tasks: {
          ...state.tasks,
          [oldColumn]: state.tasks[oldColumn].filter((task) => task.id !== id), // Remove from old column
          [newColumn]: [...state.tasks[newColumn], updatedTask], // Add to new column
        },
      };
    });

    console.log('Task moved:', id, 'from', oldColumn, 'to', newColumn);
    return {
      id: id,
      text: newText,
      type: newColumn,
    };
  },
}));
