import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ThemeProvider } from './theme-provider';
import { useState } from 'react';
import './App.css';
import Worldmap from './WorldMap';
import { ModeToggle } from './mode-toggle';

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mx-auto ">
        <div className="container flex justify-between mx-auto justify-center items-center font-mono text-2xl font-light m-10 pl-10 pr-10">
          <header className="  ">Global Growth Graph</header>
          {/* <Switch checked={} onCheckedChange={} /> */}
          <ModeToggle/>
        </div>
        <Worldmap />
      </div>
    </ThemeProvider>
  );
}

export default App;
