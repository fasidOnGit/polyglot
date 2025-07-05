import { useState } from 'react'
import './App.css'
import headerImage from './assets/header.png'
import TranslationForm from './components/TranslationForm'

function App() {
  const [translatedText, setTranslatedText] = useState<string>("")

  return (
    <div className="min-h-screen flex flex-col">
      <header 
        className="h-[30vh] relative overflow-hidden flex items-center justify-center"
        role="banner"
        aria-label="Application header with background image"
      >
        <img 
          src={headerImage}
          alt="Header background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </header>
      
      <main className="flex-1 p-6 container mx-auto max-w-2xl" role="main">
        <section aria-label="Translation form">
          <TranslationForm onTranslationComplete={setTranslatedText} />
        </section>

        {translatedText && (
          <section 
            className="mt-8 p-4 border rounded-lg bg-muted"
            aria-label="Translation result"
          >
            <h2 className="text-lg font-semibold mb-2">Translation</h2>
            <p>{translatedText}</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
