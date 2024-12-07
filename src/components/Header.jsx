import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNickname } from "../store/appVars";
import logo from '../assets/logo.png';
import {FaLinkedin,FaGithub,FaInstagramSquare } from 'react-icons/fa';


const Header = () => {
    const dispatch = useDispatch()
    return (
        <div className="flex p-2 px-12 items-center justify-between border-b-2 border-cyan-900 bg-indigo-950">
            
            <img src={logo} className="w-[70px]"/>

    
            <ul className="flex flex-row p-4 md:p-0 mt-4 text-white font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 items-center justify-center">
                <Link className="block py-2 px-3 bg-blue-700 hover:text-sky-500 transition-all rounded md:bg-transparent  md:p-0" to={'/quiz'}>Quiz</Link>
                <Link className="block py-2 px-3 bg-blue-700 hover:text-sky-500 transition-all rounded md:bg-transparent  md:p-0" to={'/scores'}>Scoreboard</Link>
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/Yusagca" className="relative z-10 text-white hover:text-sky-500 transition-all text-3xl"><FaGithub></FaGithub></a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/halil-yusa-a%C4%9Fca-26197b1b6/" className="relative z-10 text-white hover:text-sky-500 transition-all text-3xl"><FaLinkedin></FaLinkedin></a>
                <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/yusagca" className="relative z-10 text-white hover:text-sky-500 transition-all text-3xl"><FaInstagramSquare></FaInstagramSquare></a>

                
            </ul>


            <button onClick={() => dispatch(setNickname({nickname: ''}))} type="button" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
                <i className="ri-logout-circle-r-line text-lg mr-2" ></i>
                Logout
            </button>
            
        </div>
    )
}
export default Header;