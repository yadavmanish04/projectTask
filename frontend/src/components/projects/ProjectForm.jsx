import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../../validations/schemas';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

export default function ProjectForm({ defaultValues = {}, onSubmit, onCancel, submitText = 'Create' }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'active',
      deadline: '',
      ...defaultValues,
      deadline: defaultValues.deadline ? defaultValues.deadline.slice(0, 10) : '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Title" error={errors.title?.message} {...register('title')} />
      <Input label="Description" error={errors.description?.message} {...register('description')} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Status" {...register('status')}>
          <option value="active">Active</option>
          <option value="on-hold">On hold</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </Select>
        <Input label="Deadline" type="date" {...register('deadline')} />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={isSubmitting}>{submitText}</Button>
      </div>
    </form>
  );
}
