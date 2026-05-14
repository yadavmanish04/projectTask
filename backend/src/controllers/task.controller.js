const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const ensureProjectAccess = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, 'Project not found');
  const allowed =
    user.role === 'admin' ||
    project.createdBy.equals(user._id) ||
    project.teamMembers.some((m) => m.equals(user._id));
  if (!allowed) throw new ApiError(403, 'Forbidden');
  return project;
};

exports.createTask = asyncHandler(async (req, res) => {
  await ensureProjectAccess(req.body.project, req.user);
  const task = await Task.create({ ...req.body, createdBy: req.user._id });
  const populated = await task.populate([
    { path: 'assignedTo', select: 'name email avatar' },
    { path: 'createdBy', select: 'name email avatar' },
  ]);
  req.app.get('io')?.to(`project:${task.project}`).emit('task:created', populated);
  return ApiResponse(res, 201, 'Task created', { task: populated });
});

exports.listTasks = asyncHandler(async (req, res) => {
  const {
    project,
    status,
    priority,
    assignedTo,
    search = '',
    page = 1,
    limit = 50,
  } = req.query;

  // Restrict to projects the user can access
  const userProjects = await Project.find({
    $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }],
  }).select('_id');
  const allowedIds = userProjects.map((p) => p._id);

  const filter = { project: { $in: allowedIds } };
  if (project) filter.project = project;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) filter.title = new RegExp(search, 'i');

  const skip = (Number(page) - 1) * Number(limit);
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'title')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Task.countDocuments(filter),
  ]);

  return ApiResponse(res, 200, 'Tasks', { tasks }, {
    page: Number(page),
    limit: Number(limit),
    total,
  });
});

exports.getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('project', 'title')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'name email avatar' },
    });
  if (!task) throw new ApiError(404, 'Task not found');
  await ensureProjectAccess(task.project._id || task.project, req.user);
  return ApiResponse(res, 200, 'Task', { task });
});

exports.updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  await ensureProjectAccess(task.project, req.user);
  Object.assign(task, req.body);
  await task.save();
  const populated = await task.populate([
    { path: 'assignedTo', select: 'name email avatar' },
    { path: 'createdBy', select: 'name email avatar' },
  ]);
  req.app.get('io')?.to(`project:${task.project}`).emit('task:updated', populated);
  return ApiResponse(res, 200, 'Task updated', { task: populated });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  const project = await ensureProjectAccess(task.project, req.user);
  if (
    req.user.role !== 'admin' &&
    !project.createdBy.equals(req.user._id) &&
    !task.createdBy.equals(req.user._id)
  ) {
    throw new ApiError(403, 'Only admin/owner/creator can delete');
  }
  await Promise.all([task.deleteOne(), Comment.deleteMany({ task: task._id })]);
  req.app.get('io')?.to(`project:${task.project}`).emit('task:deleted', { _id: task._id });
  return ApiResponse(res, 200, 'Task deleted');
});

exports.addComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, 'Task not found');
  await ensureProjectAccess(task.project, req.user);

  const comment = await Comment.create({
    task: task._id,
    user: req.user._id,
    message: req.body.message,
  });
  task.comments.push(comment._id);
  await task.save();
  const populated = await comment.populate('user', 'name email avatar');
  req.app.get('io')?.to(`project:${task.project}`).emit('comment:created', populated);
  return ApiResponse(res, 201, 'Comment added', { comment: populated });
});
