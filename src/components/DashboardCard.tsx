
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className = "" }) => {
  return (
    <Card className={`shadow-sm flex flex-col ${className}`}>
      {title && (
        <CardHeader className="pb-2 px-4 pt-4 flex-shrink-0">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="px-4 pb-4 flex-1 flex flex-col">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
