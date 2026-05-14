import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '../../validations/schemas';
import { userApi } from '../../api/user.api';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import UserCombobox from '../common/UserCombobox';

export default function TaskForm({ defaultValues = {}, projects = [], lockedProject, onSubmit, onCancel, submitText = 'Create' }) {
  const [users, setUsers] = useState([]);
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      project: lockedProject || '',
      dueDate: '',
      assignedTo: [],
      ...defaultValues,
      project: lockedProject || defaultValues.project || '',
      dueDate: defaultValues.dueDate ? defaultValues.dueDate.slice(0, 10) : '',
      assignedTo: (defaultValues.assignedTo || []).map((u) => u._id || u),
    },
  });

  useEffect(() => {
    userApi.list('').then((res) => setUsers(res.data.users)).catch(() => {});
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Title" error={errors.title?.message} {...register('title')} />
      <Input label="Description" {...register('description')} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Priority" {...register('priority')}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
        <Select label="Status" {...register('status')}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </Select>
      </div>
      {!lockedProject && (
        <Select label="Project" error={errors.project?.message} {...register('project')}>
          <option value="">Select project</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
        </Select>
      )}
      <Input label="Due date" type="date" {...register('dueDate')} />
      <Controller
        control={control}
        name="assignedTo"
        render={({ field, fieldState }) => (
          <UserCombobox
            users={users}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={isSubmitting}>{submitText}</Button>
      </div>
    </form>
  );
}
