import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setNickname as setNicknameStore } from '../store/appVars'
import logo from '../assets/logo.png'

const Welcome = () => {
    const dispatch = useDispatch()
    //const userName = useSelector(state => state.user.name);
    const storeNickname = useSelector(state => state.appVars.nickname)
    const [nickname, setNickname] = useState('')


    return (
        <div className='flex flex-col text-center text-white items-center justify-center'>
                <img src={logo} className='w-[200px]'/>
                <span className='text-3xl font-bold'>Hoşgeldiniz!</span>
                <span className='text-xl font-medium mt-2'>Devam etmek için lütfen adınızı girin</span>
                <div className='w-[230px] flex flex-col'>
                    <div className='mt-4 mb-4'>
                        <input value={nickname} onChange={e => setNickname(e.target.value)} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nickname"/>
                    </div>
                    <button onClick={() => dispatch(setNicknameStore({'nickname': nickname}))} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'>Quize başla</button>
                </div>
        </div>
    )
}
export default Welcome