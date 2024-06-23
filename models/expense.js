const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const expenseCategorySchema = new Schema ({
  expenseAmount: Number,
  expenseCategory: String
})
const ExpenseSchema = new Schema({
  earning: {
    type: Number,
    required: true
  },
  
  expenses: [expenseCategorySchema]
  
});


module.exports = mongoose.model('expense', ExpenseSchema)