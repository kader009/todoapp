import { z } from 'zod';

// Signup validation schema
export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'Please enter a valid name format')
      .min(4, 'First name must be at least 4 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Please enter a valid name format'),
    lastName: z
      .string()
      .min(1, 'Please enter a valid name format')
      .min(4, 'Last name must be at least 4 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Please enter a valid name format'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Profile update validation schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name should only contain letters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name should only contain letters')
    .optional(),
  address: z.string().optional(),
  contactNumber: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, 'Invalid phone number format')
    .optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format')
    .optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

// Export types
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
