import { useState } from 'react'
import { Button, TextInput, Card, Title, Text, Group } from '@mantine/core'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Title order={1} className="text-center mb-8">
          Mantine + TailwindCSS Demo
        </Title>

        <Card shadow="md" padding="lg" radius="md" className="bg-white dark:bg-gray-800">
          <Title order={2} size="h3" mb="md">
            Mantine Components
          </Title>
          <Text mb="md" className="text-gray-600 dark:text-gray-300">
            These are Mantine UI components with built-in styling
          </Text>
          
          <Group mb="md">
            <Button onClick={() => setCount((c) => c + 1)} variant="filled">
              Count: {count}
            </Button>
            <Button onClick={() => setCount(0)} variant="outline" color="red">
              Reset
            </Button>
          </Group>

          <TextInput
            label="Your name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            mb="md"
          />
          
          {name && (
            <Text size="lg" fw={500}>
              Hello, {name}! 👋
            </Text>
          )}
        </Card>

        <Card shadow="md" padding="lg" radius="md" className="bg-gradient-to-r from-purple-500 to-pink-500">
          <Title order={2} size="h3" mb="md" className="text-white">
            TailwindCSS Styling
          </Title>
          <Text className="text-white/90 mb-4">
            This card uses TailwindCSS gradient utilities combined with Mantine's Card component
          </Text>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              Tailwind
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              Mantine
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              React
            </span>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">
              Pure Tailwind
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              This card uses only TailwindCSS classes
            </p>
          </div>
          
          <Card shadow="lg" padding="lg" radius="md" className="hover:shadow-xl transition-shadow">
            <Title order={3} size="h4" c="violet" mb="xs">
              Mantine Card
            </Title>
            <Text size="sm" c="dimmed">
              This uses Mantine's Card with Tailwind hover effects
            </Text>
          </Card>

          <div className="p-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-white">
              Combined
            </h3>
            <p className="text-white/90">
              Best of both worlds! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
