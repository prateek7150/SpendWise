const express = require("express");

const router = express.Router();

const{
    getExpenses,
    addExpense,
    deleteExpense
} = require("../controllers/expenseController");

//GET ALL EXPENSES
router.get("/" , getExpenses);

//POST A NEW EXPENSE

router.post("/" , addExpense);

//DELETE AN EXPENSE

router.delete("/:id",deleteExpense);

module.exports = router;