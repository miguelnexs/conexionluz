
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

interface CreateAppointmentData {
  startAt: string;
  endAt?: string;
  serviceId?: number;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAge?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  reason?: string;
  notes?: string;
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentData) => {
      const res = await api.post<{ id: number }>('/api/public/appointments/', data);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error) => {
      console.error('Failed to create appointment:', error);
    }
  });
};
