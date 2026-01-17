import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'

const Login = ({user, setUser }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (email && password) {
      try {
        const { data: userDoc } = await axios.post('/users/login', {
          email,
          password,
        })

        setUser(userDoc)
        setRedirect(true)
      } catch (error) {
        alert(`Deu ruim: ${error.response?.data || error.message}`)
      }
    } else {
      alert('Preencha todos os campos!')
    }
  }

  if (redirect || user) return <Navigate to="/" />

  return (
    <section className="flex items-center min-h-screen">
      <div className="mx-auto flex w-full max-w-96 flex-col items-center gap-4 p-8">
        <h1 className="text-3xl font-bold">Faça seu login</h1>

        <form
          className="flex w-full max-w-96 flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full rounded-full border border-gray-300 px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            className="w-full rounded-full border border-gray-300 px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-primary-400 rounded-full text-white px-4 py-2"
          >
            Login
          </button>
        </form>

        <p>
          Ainda não tem uma conta?{' '}
          <Link to="/register" className="text-primary-400 font-semibold">
            Cadastre-se
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Login
