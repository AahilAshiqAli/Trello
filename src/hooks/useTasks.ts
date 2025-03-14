import { useTaskStore } from '@/store/useTask';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';

interface TaskType {
  id: number;
  text: string;
  type?: 'todo' | 'doing' | 'done'; // status is optional to handle missing values
}
const useTasks = () => {
  const { initializeTasks } = useTaskStore();

  const query = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await axios.get<TaskType[]>('http://localhost:5000/api/tasks/');
      return data;
    },
  });
  useEffect(() => {
    if (!query.data) return;
    console.log(query.data);
    initializeTasks(query.data);
  }, [query.data, initializeTasks]);
};

export default useTasks;
