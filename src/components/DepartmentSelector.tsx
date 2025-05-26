
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { departments } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { getDepartmentTranslationKey } from '@/lib/departmentTranslations';

interface DepartmentSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ value, onValueChange }) => {
  const { t } = useLanguage();
  
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a department" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{t('departmentsTitle')}</SelectLabel>
          {departments.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              {t(getDepartmentTranslationKey(department.id))}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DepartmentSelector;
