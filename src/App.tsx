import { Button } from "@/components/ui/button"
import { useState } from 'react'
import './App.css'
import Worldmap from "./WorldMap";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container mx-auto">
      <Worldmap/>
    </div>
  )
}

export default App


