import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {BiSearchAlt, BiSolidAddToQueue, BiSolidHome, BiSolidToggleLeft, BiSolidToggleRight} from 'react-icons/bi'
import './Navbar.css'

const Navbar = () => {
    const [darkTheme, setDarkTheme] = useState(true)

    useEffect(() => {
        document.body.className = darkTheme ? 'dark' : 'light'
    }, [darkTheme])

    const toggleTheme = () => {
        setDarkTheme((prevTheme) => !prevTheme)
    }
    return (
        <nav className='navbar'>
            <div className='nav-links'>
                <Link to='/'><BiSolidHome size={30}/></Link>
                <Link to='/Create'><BiSolidAddToQueue size={30}/></Link>
                <Link to='/Search'><BiSearchAlt size={30}/></Link>
            </div>
            <div className='theme-toggle'>
                <button onClick={toggleTheme}>
                    {darkTheme ? (
                        <BiSolidToggleLeft size={40}/>
                    ) : (
                        <BiSolidToggleRight size={40}/>
                    )}
                </button>
            </div>
        </nav>
    )
}

export default Navbar