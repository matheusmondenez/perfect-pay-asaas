import express from 'express'
import Customers from './services/Customers.js'
import Payments from './services/Payments.js'

const app = express()
const port = process.env.APP_PORT

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  // res.header('Access-Control-Allow-Origin', 'http://localhost:5173/')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  next()
})

app.use(express.json())

app.get('/customers', async (req, res) => {
  const customers = new Customers()
  const result = await customers.index()

  if (result.error) {
    return res.status(result.status).json({error: result.error})
  }

  return res.status(200)
    .json({data: result})
})

app.post('/payments/create', async (req, res) => {
  const { customer, type, value, date } = req.body
  const payments = new Payments()
  const { data, error, status } = await payments.create(customer, type, value, date)

  if (error) {
    return res.status(status).json({error})
  }

  return res.status(status).json(data)
})

app.listen(port, () => console.log(`App listening on port ${port}`))
