import React, {useState, useEffect} from 'react'
import '../css-styling/header.css'
import SearchIcon from '@material-ui/icons/Search';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import {connect} from 'react-redux'
import {auth } from '../firebase/firebase';
import { useHistory } from 'react-router-dom';
import {searchInputAction} from '../store/actions';

function Header({ username, searchInputAction, searchInput, setSearchInput, productList}) {
    const history = useHistory();
    const handleAuth = () => {
        auth.signOut();
        history.push('/')
    }

    const handleSearchinput = () => {
        searchInputAction(searchInput);
    }

    useEffect(() => {
        console.log(productList)
    }, [productList])
    return (
        <div className="header">
            <h1>Productly</h1>
            <div className="search__bar">
                <input onChange={e => setSearchInput(e.target.value)} value={searchInput} type="text" placeholder="Search product name here..." className="search__input"/>
                <SearchIcon onClick={handleSearchinput} className="search__button"/>
            </div>
            <button
            onClick={handleAuth} className="user__auth" type="button"><PersonOutlineOutlinedIcon fontSize="large" /><span className="hello__text">Hello</span><span className="user_name">{username}</span></button>
            <button className="cart__icon"><span>{productList?.length}</span><LocalGroceryStoreIcon fontSize="medium" htmlColor = "white" /><span>Add to Cart</span></button>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        productList: state.products,
        username: state.users
    }
}

export default connect(mapStateToProps, {searchInputAction})(Header);
