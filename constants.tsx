import { ServiceLink } from './types';
import { 
  FileText, 
  Globe, 
  Briefcase, 
  CreditCard, 
  ShieldCheck, 
  Car, 
  Building2 
} from 'lucide-react';

export const SERVICE_LINKS: ServiceLink[] = [
  { name: 'NBI Clearance', url: 'https://clearance.nbi.gov.ph/', category: 'legal' },
  { name: 'PSA', url: 'https://appointment.psa.gov.ph/', category: 'gov' },
  { name: 'DMW Online (EREG)', url: 'https://onlineservices.dmw.gov.ph/OnlineServices/POEAOnline.aspx', category: 'gov' },
  { name: 'PEOS Online', url: 'https://peos.dmw.gov.ph/', category: 'gov' },
  { name: 'DFA Passport', url: 'https://www.passport.gov.ph/appointment/individual/site', category: 'gov' },
  { name: 'Pag-IBIG Fund', url: 'https://www.pagibigfund.gov.ph/', category: 'finance' },
  { name: 'SSS Portal', url: 'https://www.sss.gov.ph/', category: 'finance' },
  { name: 'LTO Portal', url: 'https://portal.lto.gov.ph/', category: 'legal' },
  { name: 'Police Clearance', url: 'https://pnpclearance.ph/', category: 'legal' },
];

// Reusable Options
const OPTIONS = {
  CIVIL_STATUS: ['Single', 'Married', 'Widowed', 'Separated', 'Annulled'],
  GENDER: ['Male', 'Female'],
  BLOOD_TYPE: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
  EDUCATION: ['Elementary', 'High School Graduate', 'Vocational', 'College Graduate', 'Post-Graduate'],
  PURPOSE_CLEARANCE: ['Local Employment', 'Abroad Employment', 'ID Requirement', 'Visa Requirement', 'Licensure/Board Exam', 'Others'],
  CERTIFICATE_TYPE: ['Birth Certificate', 'Marriage Certificate', 'Death Certificate', 'CENOMAR'],
  ID_TYPES: ['Passport', 'Driver\'s License', 'SSS/UMID', 'PhilID (National ID)', 'Voter\'s ID', 'Postal ID', 'PRC ID', 'Others']
};

interface RequirementDef {
  label: string;
  type: 'text' | 'select' | 'date';
  options?: string[];
}

// Map service names to their specific typed requirements
export const SERVICE_REQUIREMENTS: Record<string, RequirementDef[]> = {
  'NBI Clearance': [
    { label: 'Full Name', type: 'text' },
    { label: 'Date of Birth', type: 'date' },
    { label: 'Civil Status', type: 'select', options: OPTIONS.CIVIL_STATUS },
    { label: 'Gender', type: 'select', options: OPTIONS.GENDER },
    { label: 'Purpose of Clearance', type: 'select', options: OPTIONS.PURPOSE_CLEARANCE },
    { label: 'Mobile Number', type: 'text' }
  ],
  'PSA': [
    { label: 'Type of Certificate', type: 'select', options: OPTIONS.CERTIFICATE_TYPE },
    { label: 'Full Name on Record', type: 'text' },
    { label: 'Date of Event', type: 'date' },
    { label: 'Father\'s Full Name', type: 'text' },
    { label: 'Mother\'s Full Maiden Name', type: 'text' },
    { label: 'Purpose of Request', type: 'text' }
  ],
  'DMW Online (EREG)': [
    { label: 'Full Name', type: 'text' },
    { label: 'Passport Number', type: 'text' },
    { label: 'Gender', type: 'select', options: OPTIONS.GENDER },
    { label: 'Education', type: 'select', options: OPTIONS.EDUCATION },
    { label: 'Active Email', type: 'text' },
    { label: 'Mobile Number', type: 'text' }
  ],
  'PEOS Online': [
    { label: 'Full Name', type: 'text' },
    { label: 'Gender', type: 'select', options: OPTIONS.GENDER },
    { label: 'Highest Education', type: 'select', options: OPTIONS.EDUCATION },
    { label: 'Email Address', type: 'text' }
  ],
  'DFA Passport': [
    { label: 'Full Name', type: 'text' },
    { label: 'Date of Birth', type: 'date' },
    { label: 'Civil Status', type: 'select', options: OPTIONS.CIVIL_STATUS },
    { label: 'Valid ID Type', type: 'select', options: OPTIONS.ID_TYPES },
    { label: 'Father\'s Name', type: 'text' },
    { label: 'Mother\'s Full Maiden Name', type: 'text' }
  ],
  'Pag-IBIG Fund': [
    { label: 'Full Name', type: 'text' },
    { label: 'Date of Birth', type: 'date' },
    { label: 'Mother\'s Full Maiden Name', type: 'text' },
    { label: 'Employment Status', type: 'select', options: ['Private', 'Government', 'Self-Employed', 'OFW', 'Unemployed'] },
    { label: 'Contact Number', type: 'text' }
  ],
  'SSS Portal': [
    { label: 'Full Name', type: 'text' },
    { label: 'Date of Birth', type: 'date' },
    { label: 'Email Address', type: 'text' },
    { label: 'Mobile Number', type: 'text' },
    { label: 'UMID Card Number', type: 'text' }
  ],
  'LTO Portal': [
    { label: 'Full Name', type: 'text' },
    { label: 'Date of Birth', type: 'date' },
    { label: 'Blood Type', type: 'select', options: OPTIONS.BLOOD_TYPE },
    { label: 'Civil Status', type: 'select', options: OPTIONS.CIVIL_STATUS },
    { label: 'Email Address', type: 'text' }
  ],
  'Police Clearance': [
    { label: 'Full Name', type: 'text' },
    { label: 'Gender', type: 'select', options: OPTIONS.GENDER },
    { label: 'Civil Status', type: 'select', options: OPTIONS.CIVIL_STATUS },
    { label: 'Purpose', type: 'select', options: OPTIONS.PURPOSE_CLEARANCE },
    { label: 'Valid ID Number', type: 'text' }
  ]
};

export const getIconForService = (name: string) => {
  if (name.includes('NBI') || name.includes('Police')) return <ShieldCheck className="w-5 h-5" />;
  if (name.includes('PSA') || name.includes('DFA')) return <FileText className="w-5 h-5" />;
  if (name.includes('Pag-IBIG') || name.includes('SSS')) return <CreditCard className="w-5 h-5" />;
  if (name.includes('LTO')) return <Car className="w-5 h-5" />;
  if (name.includes('DMW') || name.includes('PEOS')) return <Briefcase className="w-5 h-5" />;
  return <Globe className="w-5 h-5" />;
};