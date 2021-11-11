var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseSchema = new Schema(
  {
    expname: { type: String, required: true },
    category: { type: [String], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

expenseSchema.index({category: 1});
expenseSchema.index({date: 1});

module.exports = mongoose.model('Expense', expenseSchema);