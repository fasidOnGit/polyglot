import './App.css'
import headerImage from './assets/header.png'

function App() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header 
        className="h-[30vh] relative overflow-hidden flex items-center justify-center w-full"
        role="banner"
        aria-label="Application header with background image"
      >
        <img 
          src={headerImage}
          alt="Header background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </header>
      
      <main className="flex-1 p-6 w-full" role="main">
        {/* Main content will be added here */}
      </main>
    </div>
  )
}

export default App
