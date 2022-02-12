import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Auth } from 'aws-amplify';

// Icons
import { GiHamburgerMenu } from 'react-icons/gi';

export function AppHeader() {
    const [isMenuOpen, setMenuState] = useState(false)

    const toggleMenu = () => {
        setMenuState(!isMenuOpen)
    }

    const onSignOut = async () => {
        await Auth.signOut()
    }

    return (
        <header className='app-header'>
            <div className={`screen-overlay ${(isMenuOpen) ? 'open' : ''}`} onClick={() => {
                toggleMenu()
            }}></div>
            <section className='header-content'>

                <NavLink className="logo" exact to="/">Amplify TodoApp</NavLink>
                <nav className='nav-container'>
                    <ul className={`nav-links clean-list ${(isMenuOpen) ? 'open' : ''}`}>
                        <NavLink exact to="/"> <li>Home</li></NavLink>
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
