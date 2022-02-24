import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';

// Services
import { storageService } from '../services/storage.service.js'

// Icons
import { GiHamburgerMenu } from 'react-icons/gi';

export function AppHeader() {
    const [isMenuOpen, setMenuState] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        loadTheme()
    }, [])

    useEffect(() => {
        isDarkMode ?
            document.body.classList.add('dark-mode') :
            document.body.classList.remove('dark-mode')

        isDarkMode ?
            storageService.saveToStorage('theme', 'dark-mode') :
            storageService.saveToStorage('theme', 'light-mode')

    }, [isDarkMode])

    const loadTheme = () => {
        const theme = storageService.loadFromStorage('theme') || 'light-mode'
        theme === 'dark-mode' ? setIsDarkMode(true) : setIsDarkMode(false)
    }

    const toggleDarkMode = () => {
        setIsDarkMode(prevDarkMode => !prevDarkMode)
    }

    const toggleMenu = () => {
        setMenuState(!isMenuOpen)
    }

    const onSignOut = async () => {
        await Auth.signOut()
    }

    return (
        <header className='app-header flex justify-center align-center'>
            <div className={`screen-overlay ${(isMenuOpen) ? 'open' : ''}`} onClick={() => {
                toggleMenu()
            }}></div>
            <section className='header-content flex justify-space-between align-center'>
                <Link className="logo" to="/">Amplify TodoApp</Link>
                <div onClick={toggleDarkMode} className="toggle-dark-mode">
                    <div className="toggle-track">
                        <div className={`dark-mode-icon-off ${isDarkMode ? 'dark-on' : 'dark-off'}`}>
                            <span className="icon-off flex align-center justify-center">🌜</span>
                        </div>
                        <div className={`dark-mode-icon-on ${isDarkMode ? 'dark-on' : 'dark-off'}`}>
                            <span className="icon-on flex align-center justify-center">🌞</span>
                        </div>
                        <div className={`toggle-track-thumb ${isDarkMode ? 'dark-on' : 'dark-off'}`}></div>
                    </div>
                </div>
                <nav className='nav-container'>
                    <ul className={`nav-links flex column clean-list ${(isMenuOpen) ? 'open' : ''}`}>
                        <NavLink to="/"> <li>Home</li></NavLink>
                        <li onClick={onSignOut} >Sign out</li>
                    </ul>
                </nav>
                <button className="hamburger-btn" onClick={() => {
                    toggleMenu()
                }}>
                    <GiHamburgerMenu className="hamburger-icon" />
                </button>
            </section>
        </header>
    );
}
