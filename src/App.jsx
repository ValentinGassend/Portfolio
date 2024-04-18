import React, {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from "./ui/views/homePage/Home.jsx";
import Menu from "./ui/components/menu/Menu.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Home/>
            <Menu/>
        </>
    )
}

export default App
