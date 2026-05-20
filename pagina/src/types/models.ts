export type Therapist = {
  id: string;
  name: string;
  specialty: string;
  image_url: string;
  rating: number;
  years_experience: number;
  description: string;
  certifications?: string[];
  price_from?: number;
  session_duration?: number;
  cv_url?: string;
};

export type Service = {
  id: number;
  title: string;
  description: string;
  priceCOP: number;
  durationMinutes?: number;
  modality?: string;
  audience?: string;
  includes?: string;
  benefits?: string;
  bookingUrl?: string;
  descriptionHtml?: string;
  isActive?: boolean;
};

export type Conversatorio = {
  id: string;
  title: string;
  description: string;
  date: string;
  end_date?: string;
  time: string;
  speaker: string;
  organizer?: string;
  modality?: string;
  participants: number;
  agenda: string[];
  status: 'past' | 'future';
  topic: string;
};
