
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { departments } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDepartmentTranslationKey } from '@/lib/departmentTranslations';

const CategoryPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('departmentsTitle')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((department) => (
          <Card key={department.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t(getDepartmentTranslationKey(department.id))}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-gray-500">{department.description}</p>
              <div className="flex justify-between items-center mt-4">
                <div>
                  <div className="text-xl font-bold">{department.totalFeedback}</div>
                  <div className="text-xs text-gray-500">{t('totalFeedbacks')}</div>
                </div>
                <Button asChild>
                  <Link to={`/departments/${department.id}`}>{t('viewDetails')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
