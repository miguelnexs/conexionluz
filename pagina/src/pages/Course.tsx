import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import PortalCoursePlayer from './PortalCoursePlayer';
import PublicCoursePreview from './PublicCoursePreview';

const CoursePage = () => {
  const { slug } = useParams();

  if (!slug) return <Navigate to="/cursos" replace />;

  const token = typeof window !== 'undefined' ? localStorage.getItem('conexionluz:token') : null;

  if (!token) return <PublicCoursePreview slug={slug} />;

  return <PortalCoursePlayer slug={slug} />;
};

export default CoursePage;
