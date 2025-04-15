import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setNickname as setNicknameStore } from '../store/appVars'
import { Star } from 'lucide-react' // sadece bir örnek için (isteğe göre farklı svg)
import FloatingStarsCanvas from '../components/FloatingStarsCanvas'

const Welcome = () => {
    const dispatch = useDispatch()
    const [nickname, setNickname] = useState('')
    const stars = Array.from({ length: 150 }, (_, i) => ({
        id: i,
        size: Math.floor(Math.random() * 32) + 10, // 10–22 px
        top: Math.floor(Math.random() * 100),     // % değer
        left: Math.floor(Math.random() * 100),
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,         // 10–20 saniye arası
        opacity: 0.2 + Math.random() * 0.4
    }))

    useEffect(() => {
        document.body.style.fontFamily = "'Inter', sans-serif"
    }, [])

    return (
        <div className="relative min-h-screen font-poppins w-full flex flex-col items-center justify-center bg-orange-400 px-6 text-gray-800 overflow-hidden">
            <FloatingStarsCanvas starCount={150}></FloatingStarsCanvas>

            {/* 🎨 Blobs */}
           

            {/* ⭐️ Stars */}
            <div className="absolute animate-float-star left-[10%] top-[80%] text-yellow-300 opacity-60"><Star size={18} /></div>
            <div className="absolute animate-float-star-delay right-[15%] top-[90%] text-orange-300 opacity-50"><Star size={14} /></div>
            <div className="absolute animate-float-star-slow left-[50%] top-[85%] text-red-400 opacity-40"><Star size={12} /></div>

            {/* Başlık */}

            {/* Form */}
            <div className="bg-white/95  p-8 shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center flex-col gap-6 z-50 transition-all duration-300 max-w-xl w-full mt-4">
                <div className="z-10 text-center space-y-3 animate-fade-in-up">
                    <h1 className="text-5xl font-pacifico tracking-tight text-orange-400 transition-all">
                        Halo's Quiz
                    </h1>

                    <p className="text-lg tracking-tight text-black">Are you ready to test your knowledge?</p>
                </div>

                <h2 className='text-3xl text-center font-semibold text-black tracking-tight'>Enter your name and start the game! 💫</h2>
                <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg text-black text-sm placeholder-gray-400 focus:ring-4 focus:ring-orange-400 focus:outline-none transition-all duration-300 transform hover:scale-105"
                />

                {/* Başla butonu */}
                <button
                    onClick={() => dispatch(setNicknameStore({ nickname }))}
                    className="w-full bg-orange-400 text-white font-bold tracking-wider py-3 rounded-xl shadow-lg transition duration-300 hover:scale-105 transform hover:shadow-2xl hover:bg-white hover:text-orange-500 hover:border-2 hover:border-orange-500"
                >
                    🚀 Start Quiz
                </button>
            </div>


        </div>
    )
}

export default Welcome
