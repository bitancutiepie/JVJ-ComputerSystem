export interface ServiceLink {
  name: string;
  url: string;
  category: 'gov' | 'finance' | 'legal';
  icon?: string;
}

export interface ClientRecord {
  id: string;
  service: string;
  username: string;
  password?: string;
  email: string;
  timestamp: string;
}

export interface ServiceRequest {
  id: string;
  serviceType: string;
  clientData: Record<string, string>;
  status: 'pending' | 'processing' | 'completed';
  timestamp: string;
}

export interface FormField {
  id: string;
  label: string;
  active: boolean;
  type?: 'text' | 'select' | 'date';
  options?: string[];
}

export interface ClientFormData {
  service: string;
  username: string;
  password?: string;
  email: string;
}

export interface PasswordState {
  lastName: string;
  firstName: string;
  number: string;
}

export interface ContactInquiry {
  name: string;
  email: string;
  subject: string;
  message: string;
}