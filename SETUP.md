# Mantine + TailwindCSS Setup

## ✅ Installation Complete

Your app now has both **Mantine UI** and **TailwindCSS** installed and configured!

### Installed Packages

#### Dependencies
- `@mantine/core@7` - Mantine UI component library
- `@mantine/hooks@7` - Useful React hooks from Mantine
- `@emotion/react` - Required peer dependency for Mantine
- `@emotion/styled` - Required peer dependency for Mantine

#### Dev Dependencies
- `tailwindcss@3` - Utility-first CSS framework
- `postcss` - CSS transformation tool
- `autoprefixer` - PostCSS plugin for vendor prefixes

### Configuration Files

1. **`tailwind.config.js`** - TailwindCSS configuration
   - Configured to scan all `.js`, `.ts`, `.jsx`, `.tsx` files in `src/`
   - Ready for customization

2. **`postcss.config.js`** - PostCSS configuration
   - Configured to use TailwindCSS and Autoprefixer

3. **`src/index.css`** - Global styles
   - Added TailwindCSS directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)

4. **`src/main.tsx`** - App entry point
   - Wrapped app with `MantineProvider`
   - Imported Mantine core styles

### Demo App

The `App.tsx` file has been updated with a comprehensive demo showing:
- ✨ Mantine components (Button, TextInput, Card, Title, Text, Group)
- 🎨 TailwindCSS utility classes (gradients, spacing, responsive design)
- 🤝 Both libraries working together seamlessly

### Usage Examples

#### Using Mantine Components
```tsx
import { Button, TextInput } from '@mantine/core';

function MyComponent() {
  return (
    <>
      <Button variant="filled">Click me</Button>
      <TextInput label="Name" placeholder="Enter name" />
    </>
  );
}
```

#### Using TailwindCSS Classes
```tsx
function MyComponent() {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg">
      <h1 className="text-2xl font-bold">Hello World</h1>
    </div>
  );
}
```

#### Combining Both
```tsx
import { Card } from '@mantine/core';

function MyComponent() {
  return (
    <Card className="bg-gradient-to-r from-purple-500 to-pink-500">
      <h2 className="text-white text-xl">Best of both worlds!</h2>
    </Card>
  );
}
```

### Running the App

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Resources

- [Mantine Documentation](https://mantine.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Mantine Components](https://mantine.dev/core/button/)
- [TailwindCSS Utilities](https://tailwindcss.com/docs/utility-first)

### Notes

- The CSS linter warnings about `@tailwind` directives are expected and can be ignored
- TailwindCSS v3 is used for compatibility with the current PostCSS setup
- Mantine's styles are imported before your custom CSS to allow easy overrides
