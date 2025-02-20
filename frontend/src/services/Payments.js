import axios from 'axios'

export const createPayment = async params => {
  const { data } = await axios.post('http://localhost:3000/payments/create', params)

  return data
}
