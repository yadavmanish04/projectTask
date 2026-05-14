const { z } = require('zod');
const { objectId } = require('./project.validator');

const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().default(''),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  assignedTo: z.array(objectId).optional().default([]),
  project: objectId,
  dueDate: z.coerce.date().optional(),
});

const updateTaskSchema = createTaskSchema.partial();

const commentSchema = z.object({
  message: z.string().min(1),
});

module.exports = { createTaskSchema, updateTaskSchema, commentSchema };
