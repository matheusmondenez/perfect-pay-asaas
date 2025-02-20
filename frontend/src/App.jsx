import { useState, useEffect, Fragment } from 'react'
import { 
  Box,
  Button,
  Callout,
  Card,
  Flex, 
  Heading,
  Text,
  TextField,
  Select,
  Separator,
  Strong,
} from '@radix-ui/themes'
import { getCustomers } from './services/Customers'
import { createPayment } from './services/Payments'

function App() {
  const [customers, setCustomers] = useState([])
  const [customer, setCustomer] = useState('')
  const [type, setType] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState()

  useEffect(() => {
    getCustomers().then(data => {
      setCustomers(data.data.data)
    }).catch(e => console.error(e))
  }, [])

  const formatValue = value => {
    const number = parseFloat(value.replace(/\D/g, '')) / 100

    if (isNaN(number)) return null

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number)
  }


  const brlToFloat = value => {
    if (!value) return 0
  
    return parseFloat(
      value.replace(/\s/g, '')
        .replace('R$', '')
        .replace('.', '')
        .replace(',', '.')
    ) || 0
  }

  const formatDate = (valor) => {
    let cleaned = valor.replace(/\D/g, '').slice(0, 8)

    if (cleaned.length > 4) {
        cleaned = cleaned.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3')
    } else if (cleaned.length > 2) {
        cleaned = cleaned.replace(/(\d{2})(\d{0,2})/, '$1/$2')
    }

    return cleaned
  }

  const formatDateToISO = date => {
    if (!date) return null
  
    const [day, month, year] = date.split('/')

    return `${year}-${month}-${day}`
  };

  const handleValue = event => {
    const value = event.target.value
    setValue(formatValue(value))
  }

  const handleDate = event => {
    const date = event.target.value
    setDate(formatDate(date))
  }

  const clearFields = () => {
    setCustomer('')
    setType('')
    setValue('')
    setDate('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    createPayment({
      customer,
      type,
      value: brlToFloat(value),
      date: formatDateToISO(date),
    }).then(data => {
      setResult({type: 'success', data: data.invoiceUrl})
      clearFields()
    }).catch(e => {
      setResult({type: 'error', data: e?.response?.data?.error || []})
    }).finally(
      setIsLoading(false)
    )
  }

  return (
    <Flex align="center" direction="column" gap="8">
      {/* Título */}
      <Heading size="8">Criar Pagamento</Heading>
      {/* Mensagem */}
      {result?.type === 'error' && (
        <Callout.Root color="red" size="3">
          <Callout.Text>
            {result?.data?.map((error, index) => <Fragment key={index}><Text color="crimson">{error}</Text><br /></Fragment>)}
          </Callout.Text>
        </Callout.Root>
      )}
      {result?.type === 'success' && (
        <Callout.Root color="green" size="3">
          <Callout.Text>
            Cobrança gerada com sucesso!<br />
            <a href={result.data} target='_blank'>Clique aqui para visualizar</a>
          </Callout.Text>
        </Callout.Root>
      )}
      {/* Formulário */}
      <Box width="600px">
        <Card>
          <Flex align="center" direction="column" gap="2">
            {/* Cliente */}
            <Text as="label"><Strong>Cliente</Strong></Text>
            <Select.Root onValueChange={setCustomer} value={customer} size="3">
              <Select.Trigger
                placeholder={customers.length > 0 ? "Selecione o Cliente" : "Carregando Clientes..."}
                style={{ width: 400 }}
              />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Clientes</Select.Label>
                    {customers.length > 0 && customers.map((customer, index) => (
                      <Select.Item key={index} value={customer.id}>{customer.name}</Select.Item>
                    ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
            <Separator my="3" size="4" />
            {/* Tipo de Pagamento */}
            <Text as="label"><Strong>Forma de Pagamento</Strong></Text>
            <Select.Root onValueChange={setType} value={type} size="3">
              <Select.Trigger placeholder="Selecione a Forma de Pagamento" style={{ width: 400 }} />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Forma de Pagamento</Select.Label>
                  <Select.Item value="BOLETO">Boleto</Select.Item>
                  <Select.Item value="PIX">Pix</Select.Item>
                  <Select.Item value="CREDIT_CARD">Cartão de Crédito</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
            <Separator my="3" size="4" />
            {/* Valor */}
            <Text as="label"><Strong>Valor</Strong></Text>
            <TextField.Root
              onChange={handleValue}
              value={value}
              size="3"
              placeholder="R$ 5,00"
              style={{ width: 400 }}
            />
            <Separator my="3" size="4" />
            {/* Vencimento */}
            <Text as="label"><Strong>Data de Vencimento</Strong></Text>
            <TextField.Root
              onChange={handleDate}
              value={date}
              maxLength={10}
              size="3"
              placeholder="DD/MM/AAAA"
              style={{ width: 400 }}
            />
            <Separator my="3" size="4" />
            {/* Submit */}
            <Button onClick={handleSubmit} loading={isLoading} size="3">
              Criar Cobrança
            </Button>
          </Flex>
        </Card>
      </Box>
    </Flex>
  )
}

export default App
