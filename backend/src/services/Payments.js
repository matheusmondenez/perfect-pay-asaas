import axios from 'axios'
import * as yup from 'yup'

class Payments {
  async create(customer, type, value, date) {
    const schema = yup.object({
      customer: yup.string()
        .required('Cliente é um campo obrigatório.'),
      type: yup.string()
        .uppercase()
        .required('Tipo de pagamento é um campo obrigatório.'),
      value: yup.number()
        .positive()
        .min(5, 'O valor do pagamento deve ser no mínimo R$5,00.')
        .required('Valor é um campo obrigatório.')
        .typeError('Data de vencimento é um campo obrigatório.'),
      date: yup.date()
        .min(new Date(), 'A data de vencimento deve ser após a data atual.')
        .required('Data de vencimento é um campo obrigatório.')
        .typeError('Data de vencimento é um campo obrigatório.'),
    })
    const body = {
      customer: customer,
      billingType: type,
      value: value,
      dueDate: date,
    }

    try {
      await schema.validate({customer, type, value, date}, { abortEarly: false })

      const { data } = await axios.post(`${process.env.ASAAS_API}/payments`, body, {
        headers: {
          accept: 'application/json',
         'content-type': 'application/json',
          access_token: process.env.ASAAS_TOKEN,
        },
      })

      return { data, status: 201 }
    } catch (e) {
      if (e.name === 'ValidationError') {
        return { error: e.errors, status: 400 }
      }

      return { error: e.message, status: e.status }
    }
  }
}

export default Payments
