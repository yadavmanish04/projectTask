const Project = require('../models/Project');
const Task = require('../models/Task');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const isMember = (project, userId) =>
  project.createdBy.equals(userId) ||
  project.teamMembers.some((m) => m.equals(userId));

exports.createProject = asyncHandler(async (req, res) => {
  const data = { ...req.body, createdBy: req.user._id };
  // Ensure creator is in team members
  data.teamMembers = Array.from(
    new Set([...(data.teamMembers || []).map(String), String(req.user._id)])
  );
  const project = await Project.create(data);
  return ApiResponse(res, 201, 'Project created', { project });
});

exports.listProjects = asyncHandler(async (req, res) => {
  const { search = '', status, page = 1, limit = 20 } = req.query;
  const filter = {
    $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }],
  };
  if (status) filter.status = status;
  if (search) filter.title = new RegExp(search, 'i');

  const skip = (Number(page) - 1) * Number(limit);
  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('teamMembers', 'name email avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Project.countDocuments(filter),
  ]);

  return ApiResponse(res, 200, 'Projects', { projects }, {
    page: Number(page),
    limit: Number(limit),
    total,
  });
});

exports.getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email avatar')
    .populate('teamMembers', 'name email avatar');
  if (!project) throw new ApiError(404, 'Project not found');
  if (!isMember(project, req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }
  return ApiResponse(res, 200, 'Project', { project });
});

exports.updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  if (!project.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Only owner/admin can update');
  }
  Object.assign(project, req.body);
  await project.save();
  return ApiResponse(res, 200, 'Project updated', { project });
});

exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  if (!project.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Only owner/admin can delete');
  }
  await Promise.all([
    project.deleteOne(),
    Task.deleteMany({ project: project._id }),
  ]);
  return ApiResponse(res, 200, 'Project deleted');
});

exports.addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  if (!project.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }
  if (!project.teamMembers.some((m) => m.equals(userId))) {
    project.teamMembers.push(userId);
    await project.save();
  }
  return ApiResponse(res, 200, 'Member added', { project });
});

exports.removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');
  if (!project.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }
  project.teamMembers = project.teamMembers.filter((m) => !m.equals(userId));
  await project.save();
  return ApiResponse(res, 200, 'Member removed', { project });
});

exports.dashboardStats = asyncHandler(async (req, res) => {
  const projectFilter = {
    $or: [{ createdBy: req.user._id }, { teamMembers: req.user._id }],
  };
  const projects = await Project.find(projectFilter).select('_id');
  const projectIds = projects.map((p) => p._id);

  const [total, todo, inProgress, done, overdue, recent] = await Promise.all([
    Task.countDocuments({ project: { $in: projectIds } }),
    Task.countDocuments({ project: { $in: projectIds }, status: 'todo' }),
    Task.countDocuments({ project: { $in: projectIds }, status: 'in-progress' }),
    Task.countDocuments({ project: { $in: projectIds }, status: 'done' }),
    Task.countDocuments({
      project: { $in: projectIds },
      status: { $ne: 'done' },
      dueDate: { $lt: new Date() },
    }),
    Task.find({ project: { $in: projectIds } })
      .sort('-updatedAt')
      .limit(8)
      .populate('project', 'title')
      .populate('assignedTo', 'name avatar'),
  ]);

  return ApiResponse(res, 200, 'Dashboard stats', {
    counts: {
      projects: projects.length,
      total,
      todo,
      inProgress,
      done,
      overdue,
    },
    recent,
  });
});
