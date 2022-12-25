import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import './Navbar.css';
import SearchBar from '../SearchBar/SearchBar'
import { FaBars } from 'react-icons/fa';
import SearchBar from '../SearchBar/SearchBar';

const Navbar = ({ isLogged, userName }) => {

  return (
    <>
      <nav className='navv'>
        <FaBars className='bars' />
        <div className='navv-menu'>
          <Link to='/' activeStyle className='navv-link'>
            Home
          </Link>
          {isLogged && (
            <Link to={'/profile/' + userName} activeStyle className='navv-link'>
              Profile
            </Link>
          )}
          {isLogged && (
            <Link to='/edit-profile' activeStyle className='navv-link'>
              Edit Profile
            </Link>
          )}
          
        </div>
        <SearchBar />
        {!isLogged ? (
          <div className='navv-button'>
            <Link to='/sign-in' className='navv-button-link'>
              Sign In
            </Link>
            <Link to='/sign-up' className='navv-button-link'>
              Sign Up
            </Link>
          </div>
        ) : (
          <div className='navv-button'>
            <a href='/sign-in' className='navv-button-link'>
              Sign Out
            </a>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
