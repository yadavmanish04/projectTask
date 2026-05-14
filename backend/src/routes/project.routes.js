const router = require('express').Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  dashboardStats,
} = require('../controllers/project.controller');
const {
  createProjectSchema,
  updateProjectSchema,
} = require('../validators/project.validator');

router.use(protect);

router.get('/stats/dashboard', dashboardStats);

router
  .route('/')
  .get(listProjects)
  .post(validate(createProjectSchema), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(validate(updateProjectSchema), updateProject)
  .delete(deleteProject);

router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
