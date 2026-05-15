import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  status: z.enum(['active', 'on-hold', 'completed', 'archived']).optional(),
  deadline: z.string().optional().or(z.literal('')),
});

export const taskSchema = z.object({
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
  project: z.string().min(1, 'Project required'),
  dueDate: z.string().optional().or(z.literal('')),
  assignedTo: z.array(z.string()).optional().default([]),
});
