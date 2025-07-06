import * as RadioGroup from "@radix-ui/react-radio-group"

export type ChatMode = "translate" | "generate-image"

interface ModeSelectorProps {
  value: ChatMode
  onChange: (value: ChatMode) => void
  disabled?: boolean
}

export function ModeSelector({ value, onChange, disabled }: ModeSelectorProps) {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      aria-label="Chat mode"
      className="flex gap-4"
    >
      <div className="flex items-center">
        <RadioGroup.Item
          value="translate"
          id="translate"
          className="h-5 w-5 rounded-full border border-gray-300 hover:border-gray-400"
        >
          <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-blue-500" />
        </RadioGroup.Item>
        <label htmlFor="translate" className="pl-2 text-sm">
          Translation
        </label>
      </div>
      <div className="flex items-center">
        <RadioGroup.Item
          value="generate-image"
          id="generate-image"
          className="h-5 w-5 rounded-full border border-gray-300 hover:border-gray-400"
        >
          <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2.5 after:h-2.5 after:rounded-full after:bg-blue-500" />
        </RadioGroup.Item>
        <label htmlFor="generate-image" className="pl-2 text-sm">
          Image Generation
        </label>
      </div>
    </RadioGroup.Root>
  )
} 