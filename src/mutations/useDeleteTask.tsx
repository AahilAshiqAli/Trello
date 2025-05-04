import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteTaskApi = async (id: number) => {
  const response = await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete task');
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Refetch tasks from API
    },
  });
};
