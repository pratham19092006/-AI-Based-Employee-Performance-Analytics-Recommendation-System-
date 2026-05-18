const Employee = require('../models/Employee');

// ─────────────────────────────────────────────
// @desc    Get all employees (filtering, sorting, pagination)
// @route   GET /api/employees
// @access  Private
// ─────────────────────────────────────────────
const getEmployees = async (req, res, next) => {
  try {
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    // Support MongoDB comparison operators: gt, gte, lt, lte
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let query = Employee.find(JSON.parse(queryStr));

    // Real-time search by name, department, or skills
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = Employee.find({
        $or: [
          { name: searchRegex },
          { department: searchRegex },
          { skills: searchRegex }
        ]
      });
    }

    // Field selection
    if (req.query.select) {
      query = query.select(req.query.select.split(',').join(' '));
    }

    // Sorting (e.g., ?sort=-performanceScore)
    query = query.sort(req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt');

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const total = await Employee.countDocuments(query.getFilter());

    query = query.skip(skip).limit(limit);
    const employees = await query;

    const pagination = {};
    if (skip + limit < total) pagination.next = { page: page + 1, limit };
    if (skip > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({ success: true, count: employees.length, pagination, total, data: employees });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Search & filter employees
// @route   GET /api/employees/search?department=Development&skills=React&minScore=70
// @access  Private
// ─────────────────────────────────────────────
const searchEmployees = async (req, res, next) => {
  try {
    const { department, skills, minScore, maxScore, minExperience, sort } = req.query;

    const filter = {};

    // Filter by department (case-insensitive)
    if (department) {
      filter.department = { $regex: new RegExp(department, 'i') };
    }

    // Filter by skills (checks if any of the comma-separated skills match)
    if (skills) {
      const skillList = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillList.map(s => new RegExp(s, 'i')) };
    }

    // Filter by performance score range
    if (minScore || maxScore) {
      filter.performanceScore = {};
      if (minScore) filter.performanceScore.$gte = Number(minScore);
      if (maxScore) filter.performanceScore.$lte = Number(maxScore);
    }

    // Filter by minimum experience
    if (minExperience) {
      filter.experience = { $gte: Number(minExperience) };
    }

    // Sorting
    const sortOption = sort ? sort.split(',').join(' ') : '-performanceScore';

    const employees = await Employee.find(filter).sort(sortOption);

    res.status(200).json({
      success: true,
      count: employees.length,
      filter: filter,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
// ─────────────────────────────────────────────
const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404);
      throw new Error(`Employee not found with id: ${req.params.id}`);
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Create new employee
// @route   POST /api/employees
// @access  Private
// ─────────────────────────────────────────────
const createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
// ─────────────────────────────────────────────
const updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404);
      throw new Error(`Employee not found with id: ${req.params.id}`);
    }
    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
// ─────────────────────────────────────────────
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404);
      throw new Error(`Employee not found with id: ${req.params.id}`);
    }
    await employee.deleteOne();
    res.status(200).json({ success: true, data: {}, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get dashboard analytics using MongoDB Aggregation
// @route   GET /api/employees/analytics/dashboard
// @access  Private
// ─────────────────────────────────────────────
const getAnalytics = async (req, res, next) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    // MongoDB Aggregation: Group by department
    const deptStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgScore: { $avg: '$performanceScore' },
          avgExperience: { $avg: '$experience' }
        }
      },
      { $sort: { avgScore: -1 } }
    ]);

    // Top 5 performers
    const topPerformers = await Employee.find()
      .sort({ performanceScore: -1 })
      .limit(5)
      .select('name department performanceScore experience');

    // Average performance score
    const avgResult = await Employee.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$performanceScore' } } }
    ]);
    const avgPerformance = avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;

    res.status(200).json({
      success: true,
      data: { totalEmployees, deptStats, topPerformers, avgPerformance }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  searchEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAnalytics
};
