import { Button } from "@/components/ui/button"
import { useState } from 'react'
import './App.css'
import WorldMap from "./WorldMap";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Button>Click me</Button>
      <WorldMap/>
    </div>
  )
}

export default App


