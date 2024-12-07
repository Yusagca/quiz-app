import { useState, useEffect } from 'react'
import AppRoutes from './views/Routes'
import { Link } from 'react-router-dom';
import Header from './components/Header';

function App() {
    return (
        <>
            <div className="bg-blue-950 h-[100vh] w-[100%] bg-gradient-to-b from-indigo-500 flex flex-col">
                <Header></Header>
                <div className='flex flex-auto items-center justify-center'><AppRoutes/></div>
            </div>
        </>
    )
}

export default App
