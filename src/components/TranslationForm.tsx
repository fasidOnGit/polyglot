import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Flag from "react-world-flags"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SupportedLanguage, TranslationRequestSchema, translateFn } from "@/lib/supabase/functions/translateFn"

interface TranslationFormProps {
  onTranslationComplete?: (translatedText: string) => void
}

interface LanguageOption {
  value: SupportedLanguage
  label: string
  code: string
}

function TranslationForm({ onTranslationComplete }: TranslationFormProps) {
  const form = useForm<z.infer<typeof TranslationRequestSchema>>({
    resolver: zodResolver(TranslationRequestSchema),
    defaultValues: {
      prompt: "",
      lang: "french"
    }
  })

  async function onSubmit(values: z.infer<typeof TranslationRequestSchema>) {
    try {
      const result = await translateFn(values)
      onTranslationComplete?.(result.text)
    } catch (error) {
      console.error("Translation failed:", error)
      form.setError("root", {
        message: "Translation failed. Please try again."
      })
    }
  }

  const languages: LanguageOption[] = [
    { value: "french", label: "French", code: "FR" },
    { value: "spanish", label: "Spanish", code: "ES" },
    { value: "arabic", label: "Arabic", code: "SA" }, // Using Saudi Arabia for Arabic
    { value: "hindi", label: "Hindi", code: "IN" }
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto space-y-6 p-6 rounded-3xl border-[4px] border-[#252F42]">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#0066CC] flex items-center justify-center gap-2">
            Text to translate
            <span role="img" aria-label="pointing down">👇</span>
          </h2>
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="How are you?"
                    {...field}
                    aria-label="Text to translate"
                    className="bg-gray-50 text-lg py-6 rounded-xl border-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#0066CC] flex items-center justify-center gap-2">
            Select language
            <span role="img" aria-label="pointing down">👇</span>
          </h2>
          <FormField
            control={form.control}
            name="lang"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid gap-3"
                  >
                    {languages.map(({ value, label, code }) => (
                      <RadioGroupItem
                        key={value}
                        value={value}
                        label={label}
                        prefixIcon={
                          <Flag
                            code={code}
                            className="h-8 w-10 object-contain"
                            fallback={<span className="h-8 w-10 bg-gray-200" />}
                          />
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#035A9D] hover:bg-[#024B82] text-white text-xl py-6 rounded-xl font-extrabold"
        >
          Translate
        </Button>

        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {form.formState.errors.root.message}
          </p>
        )}
      </form>
    </Form>
  )
}

export default TranslationForm 