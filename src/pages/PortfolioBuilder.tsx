import React from 'react';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import { PortfolioDashboard } from '@/components/portfolio/PortfolioDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';

const PortfolioBuilder: React.FC = () => {
  const { profile } = useUserProfile();
  const isPremium = profile?.is_premium || false;

  return (
    <div className="h-screen overflow-hidden">
      <PortfolioProvider isPremium={isPremium}>
        <PortfolioDashboard />
      </PortfolioProvider>
    </div>
  );
};

export default PortfolioBuilder;