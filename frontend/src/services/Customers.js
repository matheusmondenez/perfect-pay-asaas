import axios from 'axios'

export const getCustomers = () => {
  return axios.get('http://localhost:3000/customers')
}
