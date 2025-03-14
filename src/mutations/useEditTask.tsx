import { useMutation, useQueryClient } from '@tanstack/react-query';

const editTaskApi = async (task: { id: number; text: string; type: string }) => {
  const response = await fetch('http://localhost:5000/api/tasks/', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to edit task');
  return response.json();
};

export const useEditTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editTaskApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
