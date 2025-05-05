import { LoginForm } from '@/components/LoginForm'
import { Footer } from '@/components/Footer'
import { FAQList } from '@/components/FAQList'
import './App.css'

function App() {
  return (
    <>
      <div>
        <h1>Welcome Back</h1>
        <LoginForm />
        <FAQList 
          faqs={[]} 
          categories={[
            { id: 'general', name: 'General' },
            { id: 'payments', name: 'Payments' },
            { id: 'security', name: 'Security' },
            { id: 'account', name: 'Account' },
            { id: 'technical', name: 'Technical' }
          ]} 
        />
      </div>
      <Footer />
    </>
  )
}

export default App