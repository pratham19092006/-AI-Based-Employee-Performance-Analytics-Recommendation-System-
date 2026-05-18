const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design', 'Product']
  },
  skills: {
    type: [String],
    required: [true, 'Please add at least one skill']
  },
  performanceScore: {
    type: Number,
    required: [true, 'Please add a performance score'],
    min: [1, 'Score must be at least 1'],
    max: [100, 'Score cannot be more than 100']
  },
  experience: {
    type: Number, // In years
    required: [true, 'Please add experience in years'],
    min: [0, 'Experience cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
