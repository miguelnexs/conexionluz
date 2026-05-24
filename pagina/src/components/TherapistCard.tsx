
import React from 'react';
import { Star, Award, Calendar, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TherapistCardProps {
  id: string;
  name: string;
  specialty: string;
  image?: string;
  rating: number;
  experience: string;
  description: string;
  certifications: string[];
  priceFrom?: number;
  sessionDuration?: number;
  cvUrl?: string;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  id,
  name,
  specialty,
  image,
  rating,
  experience,
  description,
  certifications,
  priceFrom,
  sessionDuration,
  cvUrl
}) => {
  const navigate = useNavigate();

  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  const handleScheduleClick = () => {
    navigate(`/agenda?therapist=${id}&therapistName=${encodeURIComponent(name)}`);
  };

  const handleDownloadCV = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cvUrl) {
      const link = document.createElement('a');
      link.href = cvUrl;
      link.download = `${name}_Curriculo.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-80 bg-gray-50 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-accent/10">
            <div className="w-24 h-24 rounded-full bg-white/70 backdrop-blur-sm shadow-lg flex items-center justify-center text-2xl font-bold text-gray-700 ring-1 ring-gray-200">
              {initials}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
          <Star className="h-4 w-4 text-amber-400 fill-current" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <p className="text-accent font-medium">{specialty}</p>
        </div>

        {/* Experience */}
        {experience && (
          <div className="flex items-center space-x-2 mb-3 text-gray-600">
            <Award className="h-4 w-4" />
            <span className="text-sm">{experience}</span>
          </div>
        )}

        {/* Price and Duration */}
        {(priceFrom || sessionDuration) && (
          <div className="flex justify-between items-center mb-3 text-sm">
            {priceFrom && (
              <span className="text-primary font-semibold">
                Desde ${priceFrom.toLocaleString()}
              </span>
            )}
            {sessionDuration && (
              <span className="text-gray-500">{sessionDuration} min</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {description}
        </p>

        {/* Certifications */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col space-y-3">
          <button 
            onClick={handleScheduleClick}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Agendar Cita</span>
          </button>
          
          {cvUrl && (
            <button 
              onClick={handleDownloadCV}
              className="w-full bg-white text-primary border-2 border-primary py-3 rounded-xl font-semibold hover:bg-primary/5 transition-all duration-300 flex items-center justify-center space-x-2 group/cv"
            >
              <FileDown className="h-4 w-4 group-hover/cv:scale-110 transition-transform" />
              <span>Ver Currículo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistCard;
