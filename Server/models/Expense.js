const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    name:{
        type :String,
        required : true
    },
    amount:{
        type:Number,
        required: true
    },
    category:{
        type:String
    },
    date:{
        type: String
    }
});

module.exports = mongoose.model("Expense" , expenseSchema);