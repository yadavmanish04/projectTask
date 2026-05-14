const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

const createProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().default(''),
  image: z.string().url().optional().or(z.literal('')),
  teamMembers: z.array(objectId).optional().default([]),
  status: z.enum(['active', 'on-hold', 'completed', 'archived']).optional(),
  deadline: z.coerce.date().optional(),
});

const updateProjectSchema = createProjectSchema.partial();

module.exports = { createProjectSchema, updateProjectSchema, objectId };
