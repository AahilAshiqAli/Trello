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
  editTask: (column: 'todo' | 'doing' | 'done', id: number, newText: string) => void;
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

  editTask: (column, id, newText) => {
    const editedTask = { id, text: newText, type: column };
    set((state) => ({
      tasks: {
        ...state.tasks,
        [column]: state.tasks[column].map((task) =>
          task.id === id ? { ...task, text: newText } : task,
        ),
      },
    }));

    return editedTask;
  },
}));
