import { z } from 'zod';
import { phoneSchema } from './validation';

export { phoneSchema } from './validation';

export const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  phone: phoneSchema,
  companyName: z.string().optional(),
  serviceInterest: z.enum(['ftl', 'ptl', 'dedicated', 'container', 'odc', 'transporter']),
  message: z.string().min(10, 'Please provide at least 10 characters'),
});

export const transporterRegistrationSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person must be at least 2 characters'),
  phone: phoneSchema,
  email: z.string().email('Please enter a valid email address'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  fleetSize: z.number().int().min(1, 'Fleet size must be at least 1'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid PAN number'),
  gstin: z.string().optional(),
});

export const driverRegistrationSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  phone: phoneSchema,
  licenceNumber: z.string().min(5, 'Enter a valid licence number'),
  experienceYears: z.number().int().min(1, 'Experience must be at least 1 year'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
});
