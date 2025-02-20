import axios from 'axios'

class Customers {
  async index() {
    try {
      const { data } = await axios.get(`${process.env.ASAAS_API}/customers`, {
        headers: {
          accept: 'application/json',
         'content-type': 'application/json',
          access_token: process.env.ASAAS_TOKEN,
        },
      })
  
      return data.data.map(customer => ({
        name: customer.name,
        id: customer.id
      }))
    } catch (e) {
      return { error: e.message, status: e.status }
    }
  }
}

export default Customers
