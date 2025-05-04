import { useMutation, useQueryClient } from '@tanstack/react-query';

const createTaskApi = async (task: { id: number; text: string; type: string }) => {
  const response = await fetch('http://localhost:3000/api/v1/tasks/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to add task');
  return response.json();
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Refetch tasks from API
    },
  });
};
