require('dotenv').config();
const express = require('express');
const app = express();
const expenseModel = require('./models/expense');


const connectDB = require('./config/db');

connectDB()

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));


app.get('/', async (req, res) => {
  try {
    const expenseData = await expenseModel.findOne()
    const expenses = expenseData.expenses
    const earning = expenseData.earning
    let totalExpenses = 0
    for (let i = 0; i < expenses.length; i++){
      totalExpenses += expenses[i].expenseAmount
    }
    const balance = earning - totalExpenses

    res.render('main.ejs', {
      expenseData,
      totalExpenses,
      balance
    })
    
  } catch (err) {
    console.log(err)
  } 
})

app.post('/earning', async (req, res) => {
  try{
    const expenseData = await expenseModel.findOne()
    const updatedEarning = expenseData.earning + parseInt(req.body.earning)
    await expenseModel.updateOne(
      {_id: expenseData._id},
      {
        $set: {
          earning: updatedEarning
        }
      }
    )
    res.redirect('/')

  } catch(err){
    console.log(err)
  }
})

app.post('/expense', async (req, res) => {
  try {
    const expenseData = await expenseModel.findOne()
    const expenses = expenseData.expenses
    const expenseIndex = expenses.findIndex(expense => expense.expenseCategory === req.body.expenseCategory)
    if(expenseIndex > -1){
      expenses[expenseIndex].expenseAmount += parseInt(req.body.expenseAmount)
    } else {
      expenses.push({ 
        expenseAmount: req.body.expenseAmount,
        expenseCategory: req.body.expenseCategory
      })
    }
    
    await expenseModel.updateOne(
      { _id: expenseData._id },
      {
        $set: {
          expenses
        }
      },
    )
    res.redirect('/')
  } catch(err){
      console.log(err)
  }
})

app.post('/delete/:id', async (req, res) => {
  try{
    const expenseData = await expenseModel.findOne()
    const expenses = expenseData.expenses
    const expenseIdIndex = expenses.findIndex(expense => expense._id === req.params._id)
    expenses.splice(expenseIdIndex)

    await expenseModel.updateOne(
      { _id: expenseData._id },
      {
        $set: {
          expenses
        }
      },
    )

    res.redirect('/')
  } catch (err){
    console.log (err)
  }
})


function updateDatabase(){
  expenseModel.create({
    earning: 10000,
    expenses:[],
  })
}

// updateDatabase()

app.use(express.static('public'))
app.listen(8080)
