const Employee = require('../models/Employee');
const { generateOpenRouterResponse } = require('../services/aiService');
const {
  generateRecommendationPrompt,
  generateSummaryPrompt,
  generateRankingPrompt,
  generateTrainingPrompt,
  generateFeedbackPrompt
} = require('../utils/aiPrompts');

/**
 * Helper to safely parse JSON from AI response
 * Handles cases where AI wraps response in markdown code blocks
 */
const safeParseJSON = (text) => {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
};

// ─────────────────────────────────────────────
// @desc    AI Promotion & Growth Recommendation for ONE employee
// @route   POST /api/ai/recommend
// @access  Private
// ─────────────────────────────────────────────
const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      res.status(400);
      throw new Error('Please provide an employeeId');
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    const prompt = generateRecommendationPrompt(employee);
    const aiResponseText = await generateOpenRouterResponse(prompt);

    let data;
    try {
      data = safeParseJSON(aiResponseText);
    } catch (parseError) {
      data = { rawResponse: aiResponseText, parseError: true };
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    AI-powered ranking of ALL employees
// @route   POST /api/ai/ranking
// @access  Private
// ─────────────────────────────────────────────
const getRanking = async (req, res, next) => {
  try {
    const employees = await Employee.find().limit(20);

    if (employees.length === 0) {
      return res.status(200).json({ success: true, data: { rankings: [], summary: 'No employees to rank.' } });
    }

    const prompt = generateRankingPrompt(employees);
    const aiResponseText = await generateOpenRouterResponse(prompt);

    let data;
    try {
      data = safeParseJSON(aiResponseText);
    } catch {
      data = { rawResponse: aiResponseText, parseError: true };
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    AI Training Plan for all/selected employees
// @route   POST /api/ai/training
// @access  Private
// ─────────────────────────────────────────────
const getTrainingPlan = async (req, res, next) => {
  try {
    const { employeeIds } = req.body; // optional: array of specific IDs
    
    let employees;
    if (employeeIds && employeeIds.length > 0) {
      employees = await Employee.find({ _id: { $in: employeeIds } });
    } else {
      employees = await Employee.find().limit(15);
    }

    if (employees.length === 0) {
      return res.status(200).json({ success: true, data: { individualPlans: [], teamTrainings: [] } });
    }

    const prompt = generateTrainingPrompt(employees);
    const aiResponseText = await generateOpenRouterResponse(prompt);

    let data;
    try {
      data = safeParseJSON(aiResponseText);
    } catch {
      data = { rawResponse: aiResponseText, parseError: true };
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    AI Performance Feedback for one employee
// @route   POST /api/ai/feedback
// @access  Private
// ─────────────────────────────────────────────
const getFeedback = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      res.status(400);
      throw new Error('Please provide an employeeId');
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    const prompt = generateFeedbackPrompt(employee);
    const aiResponseText = await generateOpenRouterResponse(prompt);

    let data;
    try {
      data = safeParseJSON(aiResponseText);
    } catch {
      data = { rawResponse: aiResponseText, parseError: true };
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    AI Executive Team Summary
// @route   GET /api/ai/summary
// @access  Private
// ─────────────────────────────────────────────
const getTeamSummary = async (req, res, next) => {
  try {
    const employees = await Employee.find().select('name department performanceScore experience').limit(20);

    if (employees.length === 0) {
      return res.status(200).json({ success: true, data: 'No employees to summarize.' });
    }

    const prompt = generateSummaryPrompt(employees);
    const summary = await generateOpenRouterResponse(prompt);

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendation,
  getRanking,
  getTrainingPlan,
  getFeedback,
  getTeamSummary
};
