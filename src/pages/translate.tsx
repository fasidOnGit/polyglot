import TranslationForm from "@/components/TranslationForm"
import { useState } from "react"

export function TranslatePage() {
  const [translatedText, setTranslatedText] = useState<string>("")

  return (
    <section aria-label="Translation section">
      <TranslationForm onTranslationComplete={setTranslatedText} />

      {translatedText && (
        <section 
          className="mt-8 p-4 border rounded-lg bg-muted"
          aria-label="Translation result"
        >
          <h2 className="text-lg font-semibold mb-2">Translation</h2>
          <p>{translatedText}</p>
        </section>
      )}
    </section>
  )
} 