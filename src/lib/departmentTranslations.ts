
import { en } from '../translations/en';

type TranslationsType = typeof en;

// Map department IDs to translation keys
export const getDepartmentTranslationKey = (departmentId: string): keyof TranslationsType => {
  const keyMap: Record<string, keyof TranslationsType> = {
    'emergency': 'departmentEmergency',
    'outpatient-clinic': 'departmentOutpatientClinic',
    'inpatient-ward': 'departmentInpatientWard',
    'radiology': 'departmentRadiology',
    'laboratory': 'departmentLaboratory',
    'pharmacy': 'departmentPharmacy',
    'billing': 'departmentBilling',
    'mortuary': 'departmentMortuary',
    'maternity': 'departmentMaternity',
    'immunization': 'departmentImmunization',
  };
  
  return keyMap[departmentId] || 'departmentEmergency';
};
