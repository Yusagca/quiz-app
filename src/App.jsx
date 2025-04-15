import { useState, useEffect } from 'react'
import AppRoutes from './views/Routes'
import { Link } from 'react-router-dom';

function App() {
    return (
        <>
          
                
                <div className='flex flex-auto items-center justify-center'>
                    <AppRoutes/>
                    </div>
        </>
    )
}

export default App
