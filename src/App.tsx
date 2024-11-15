import { ThemeProvider } from './theme-provider';
import './App.css';
import Worldmap from './Worldmap';
import { ModeToggle } from './mode-toggle';
import Reset from './Reset';
function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container  mx-auto lg:mx-auto">
        <div className="container flex justify-between mx-auto  items-center font-mono text-2xl font-light m-10 pl-10 pr-10">
          <header className="sm:text-xl lg:text-3xl">Global Growth Graph</header>
          {/* <Switch checked={} onCheckedChange={} /> */}
          <ModeToggle/>
        </div >
        <Worldmap />
        <Reset/>
      </div>
    </ThemeProvider>
  );
}

export default App;
