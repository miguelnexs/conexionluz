
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Service } from '@/types/models';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await api.get<Service[]>('/api/services/');
      if (!res.ok) throw new Error(res.error);
      return res.data.filter((s) => s.isActive !== false);
    }
  });
};

export const useServiceById = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const serviceId = Number(id);
      if (!Number.isFinite(serviceId)) throw new Error('Invalid service id');
      const res = await api.get<Service>(`/api/services/${serviceId}/`);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
    enabled: !!id
  });
};
