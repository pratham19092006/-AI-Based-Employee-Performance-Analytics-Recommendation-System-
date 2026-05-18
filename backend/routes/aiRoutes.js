const express = require('express');
const router = express.Router();
const {
  getRecommendation,
  getRanking,
  getTrainingPlan,
  getFeedback,
  getTeamSummary
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All AI routes require authentication
router.use(protect);

// POST /api/ai/recommend  → Full analysis for ONE employee
router.post('/recommend', getRecommendation);

// POST /api/ai/ranking    → AI-powered ranking of ALL employees
router.post('/ranking', getRanking);

// POST /api/ai/training   → Training plan for team or selected employees
router.post('/training', getTrainingPlan);

// POST /api/ai/feedback   → Performance feedback for ONE employee
router.post('/feedback', getFeedback);

// GET /api/ai/summary     → Executive summary of the whole team
router.get('/summary', getTeamSummary);

module.exports = router;
