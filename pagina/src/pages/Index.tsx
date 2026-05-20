
import React from 'react';
import Hero from '../components/Hero';
import PublicLayout from '../components/PublicLayout';
import MembershipSection from '../components/MembershipSection';

const Index = () => {
  return (
    <PublicLayout contentClassName="p-0">
      <Hero />
      <MembershipSection />
    </PublicLayout>
  );
};

export default Index;
