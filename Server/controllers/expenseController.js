const Expense = require("../models/Expense");

//Fetching Expenses
exports.getExpenses = async (req,res)=>{
    try{
        const expenses = await Expense.find().sort({date :-1});
        res.json(expenses);
    }catch(err){
        res.status(500).join({message: err.message});
    }
};

//Adding Expense
exports.addExpense = async(req,res)=>{
    const{name ,amount , category ,date } = req.body;
    try{
        const newExpense = new Expense({name,amount, category , date});
        await newExpense.save();
        res.status(201).json(newExpense);
    }catch(err){
        res.status(400).json({message : err.message});
    }
};
//Delete Expenses By Id

exports.deleteExpense = async (req, res) => {
    try {
        const deleted = await Expense.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json({ message: "Expense deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
