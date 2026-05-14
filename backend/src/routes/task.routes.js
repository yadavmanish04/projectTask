const router = require('express').Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  addComment,
} = require('../controllers/task.controller');
const {
  createTaskSchema,
  updateTaskSchema,
  commentSchema,
} = require('../validators/task.validator');

router.use(protect);

router
  .route('/')
  .get(listTasks)
  .post(validate(createTaskSchema), createTask);

router
  .route('/:id')
  .get(getTask)
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

router.post('/:id/comments', validate(commentSchema), addComment);

module.exports = router;
