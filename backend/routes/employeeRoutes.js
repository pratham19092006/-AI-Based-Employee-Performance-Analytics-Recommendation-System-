const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAnalytics,
  searchEmployees
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// All employee routes require a valid JWT
router.use(protect);

/**
 * Validation rules for creating/updating an employee
 */
const employeeValidationRules = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('department')
    .notEmpty().withMessage('Department is required')
    .isIn(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Product'])
    .withMessage('Invalid department'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('performanceScore')
    .isNumeric().withMessage('Performance score must be a number')
    .isFloat({ min: 1, max: 100 }).withMessage('Performance score must be between 1 and 100'),
  body('experience')
    .isNumeric().withMessage('Experience must be a number')
    .isFloat({ min: 0 }).withMessage('Experience cannot be negative'),
];

/**
 * Middleware to check express-validator results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return next(new Error(errors.array().map(e => e.msg).join(', ')));
  }
  next();
};

// ─────────────────────────────────────────────
// Special routes — must be BEFORE /:id routes
// ─────────────────────────────────────────────

// GET /api/employees/analytics/dashboard
router.get('/analytics/dashboard', getAnalytics);

// GET /api/employees/search?department=Development&skills=React&minScore=70
router.get('/search', searchEmployees);

// ─────────────────────────────────────────────
// Standard CRUD routes
// ─────────────────────────────────────────────

router
  .route('/')
  .get(getEmployees)
  .post(employeeValidationRules, validate, createEmployee);

router
  .route('/:id')
  .get(getEmployee)
  .put(employeeValidationRules, validate, updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
