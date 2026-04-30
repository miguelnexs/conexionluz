
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { Therapist } from '@/types/models';

type BackendTherapist = {
  id: number;
  name: string;
  title: string;
  description?: string;
  specialties: string[];
  modality: string;
  location: string;
  priceFromCOP?: number;
  sessionDurationMinutes?: number;
  photoUrl?: string | null;
  cvUrl?: string | null;
  isActive?: boolean;
};

const toUiTherapist = (t: BackendTherapist): Therapist => {
  const specialty = t.title?.trim() || t.specialties?.[0]?.trim() || 'Terapeuta';
  return {
    id: String(t.id),
    name: t.name,
    specialty,
    image_url: t.photoUrl || '',
    rating: 5,
    years_experience: 0,
    description: t.description || '',
    certifications: t.specialties || [],
    price_from: typeof t.priceFromCOP === 'number' ? t.priceFromCOP : undefined,
    session_duration: typeof t.sessionDurationMinutes === 'number' ? t.sessionDurationMinutes : undefined,
    cv_url: t.cvUrl || undefined
  };
};

export const useTherapists = () => {
  return useQuery({
    queryKey: ['therapists'],
    queryFn: async () => {
      const res = await api.get<BackendTherapist[]>('/api/therapists/');
      if (!res.ok) throw new Error(res.error);
      return res.data.filter((t) => t.isActive !== false).map(toUiTherapist);
    }
  });
};

export const useTherapistById = (id: string) => {
  return useQuery({
    queryKey: ['therapist', id],
    queryFn: async () => {
      const numericId = Number(id);
      if (!Number.isFinite(numericId)) throw new Error('Invalid therapist id');
      const res = await api.get<BackendTherapist>(`/api/therapists/${numericId}/`);
      if (!res.ok) throw new Error(res.error);
      return toUiTherapist(res.data);
    },
    enabled: !!id
  });
};
