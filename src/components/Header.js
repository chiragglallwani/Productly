import React from 'react'
import '../css-styling/header.css'
import SearchIcon from '@material-ui/icons/Search';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import {connect} from 'react-redux'
import {auth } from '../firebase/firebase';
import { useHistory } from 'react-router-dom';

function Header({user}) {
    const history = useHistory();
    const handleAuth = () => {
        auth.signOut();
        history.push('/')
    }

    return (
        <div className="header">
            <h1>Productly</h1>
            <div className="search__bar">
                <input className="search__input" type="text" placeholder="Search by categories here..."/>
                <SearchIcon className="search__button" />
            </div>
            <button
            onClick={handleAuth} className="user__auth" type="button"><PersonOutlineOutlinedIcon fontSize="large" />Hello<span className="user_name">{user}</span></button>
            <button className="cart__icon"><LocalGroceryStoreIcon fontSize="medium" htmlColor = "white" />Add to cart</button>
        </div>
    )
}

const mapStateToProps = state => {
    console.log(state.users)
    return {
        user: state.users
    };
}

export default connect(mapStateToProps)(Header);
