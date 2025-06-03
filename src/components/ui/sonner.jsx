import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

// ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {}
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
