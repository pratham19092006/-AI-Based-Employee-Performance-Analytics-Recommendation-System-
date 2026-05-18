/**
 * AI Prompts Utility
 * All prompts used for OpenRouter API calls
 */

/**
 * Generates a comprehensive employee analysis prompt
 * Returns JSON with promotion, strengths, weaknesses, training, growth
 */
const generateRecommendationPrompt = (employee) => {
  return `You are an expert HR analyst. Analyze this employee and return ONLY valid JSON (no markdown, no explanation).

Employee Profile:
- Name: ${employee.name}
- Department: ${employee.department}
- Skills: ${employee.skills.join(', ')}
- Performance Score: ${employee.performanceScore}/100
- Years of Experience: ${employee.experience}

Return this exact JSON structure:
{
  "promotionEligibility": "string (e.g., Highly Eligible - 3+ years experience with 85+ score)",
  "overallRating": "string (Outstanding/Excellent/Good/Average/Below Average)",
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "requiredTraining": ["training1", "training2", "training3"],
  "skillGaps": ["skill1", "skill2"],
  "salaryBand": "string (e.g., Mid-Senior: ₹12-18 LPA)",
  "futureGrowthSuggestions": "string (2-3 sentences)",
  "actionPlan": "string (immediate next steps in 1-2 sentences)"
}`;
};

/**
 * Generates a team executive summary prompt
 */
const generateSummaryPrompt = (employees) => {
  const data = employees.map(emp => ({
    name: emp.name,
    department: emp.department,
    score: emp.performanceScore,
    experience: emp.experience
  }));
  return `As an HR executive, write a brief 2-3 sentence executive summary of this team's performance. Be insightful and specific. Team data: ${JSON.stringify(data)}`;
};

/**
 * Generates an AI-powered ranking prompt for multiple employees
 */
const generateRankingPrompt = (employees) => {
  const data = employees.map(emp => ({
    id: emp._id,
    name: emp.name,
    department: emp.department,
    skills: emp.skills,
    score: emp.performanceScore,
    experience: emp.experience
  }));
  return `You are an expert HR AI. Rank these employees based on overall value to organization (performance + experience + skills breadth). Return ONLY valid JSON (no markdown).

Employees: ${JSON.stringify(data)}

Return this exact structure:
{
  "rankings": [
    {
      "rank": 1,
      "id": "employee_id",
      "name": "name",
      "score": 95,
      "badge": "🏆 Top Performer",
      "reason": "specific reason for this rank"
    }
  ],
  "summary": "2-sentence overall team analysis"
}`;
};

/**
 * Generates a training suggestions prompt
 */
const generateTrainingPrompt = (employees) => {
  const data = employees.map(emp => ({
    name: emp.name,
    department: emp.department,
    skills: emp.skills,
    score: emp.performanceScore
  }));
  return `As a Learning & Development AI expert, analyze these employees and create a targeted training plan. Return ONLY valid JSON (no markdown).

Employees: ${JSON.stringify(data)}

Return this exact structure:
{
  "individualPlans": [
    {
      "name": "employee_name",
      "priority": "High/Medium/Low",
      "courses": ["course1", "course2"],
      "certifications": ["cert1"],
      "estimatedDuration": "e.g., 3 months"
    }
  ],
  "teamTrainings": ["team-wide training1", "team-wide training2"],
  "budgetEstimate": "string (e.g., ₹50,000 - ₹1,00,000 for the team)"
}`;
};

/**
 * Generates AI feedback for a single employee
 */
const generateFeedbackPrompt = (employee) => {
  return `You are an empathetic performance coach. Write constructive professional feedback for this employee. Return ONLY valid JSON (no markdown).

Employee: ${employee.name}, ${employee.department}, Score: ${employee.performanceScore}/100, Experience: ${employee.experience} years, Skills: ${employee.skills.join(', ')}

Return this exact structure:
{
  "performanceSummary": "2-sentence performance overview",
  "positiveFeedback": "specific praise based on high score or strengths",
  "constructiveFeedback": "specific areas for improvement",
  "goalSetting": ["SMART goal 1", "SMART goal 2", "SMART goal 3"],
  "managerNote": "confidential note to manager about this employee",
  "nextReviewDate": "Suggested review timeline (e.g., 3 months)"
}`;
};

module.exports = {
  generateRecommendationPrompt,
  generateSummaryPrompt,
  generateRankingPrompt,
  generateTrainingPrompt,
  generateFeedbackPrompt
};
