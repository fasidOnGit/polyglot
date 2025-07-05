import Flag from "react-world-flags"
import type { SupportedLanguage } from "@/lib/supabase/functions/translateFn"
import { cn } from "@/lib/utils"

interface LanguageOption {
  value: SupportedLanguage
  label: string
  code: string
}

const languages: LanguageOption[] = [
  { value: "french", label: "French", code: "FR" },
  { value: "spanish", label: "Spanish", code: "ES" },
  { value: "arabic", label: "Arabic", code: "SA" }, // Using Saudi Arabia for Arabic
  { value: "hindi", label: "Hindi", code: "IN" }
]

interface LanguageSelectorProps {
  value: SupportedLanguage
  onChange: (value: SupportedLanguage) => void
  disabled?: boolean
}

export function LanguageSelector({ value, onChange, disabled }: LanguageSelectorProps) {
  return (
    <div className="border-t pt-4">
      <p className="text-sm font-medium text-gray-500 mb-2">Assistant will respond in:</p>
      <div className="flex gap-3 items-center">
        {languages.map(({ value: langValue, label, code }) => (
          <button
            key={langValue}
            onClick={() => onChange(langValue)}
            disabled={disabled}
            className={cn(
              "relative p-1 rounded-lg transition-all duration-200 hover:bg-gray-100",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              value === langValue && "bg-blue-50 ring-2 ring-blue-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            title={label}
          >
            <Flag
              code={code}
              className="h-8 w-10 object-contain rounded shadow-sm"
              fallback={<span className="h-8 w-10 bg-gray-200 rounded" />}
            />
            {value === langValue && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
} 