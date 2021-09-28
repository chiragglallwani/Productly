import React, { useEffect, useState} from 'react'
import '../css-styling/header.css'
import SearchIcon from '@material-ui/icons/Search';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import {connect} from 'react-redux'
import {auth, db } from '../firebase/firebase';
import { useHistory } from 'react-router-dom';
import {searchInputAction} from '../store/actions';
import {Link} from 'react-router-dom'

function Header({ username, searchInputAction, searchInput, setSearchInput}) {
    const [productList, setProductList] = useState(0);
    const history = useHistory();
    const handleAuth = () => {
        auth.signOut();
        history.push('/')
    }

    const handleSearchinput = () => {
        searchInputAction(searchInput);
    }

    useEffect(() => {
        db.collection('users').doc(auth.currentUser?.uid).get().then((doc) => {
            setProductList(doc.data()?.productList);
        }).catch(err => console.warn(err));
    }, [productList])
    return (
        <div className="header">
            <Link className="brand__name" to="/home">Productly</Link>
            <div className="search__bar">
                <input onChange={e => setSearchInput(e.target.value)} value={searchInput} type="text" placeholder="Search product name here..." className="search__input"/>
                <SearchIcon onClick={handleSearchinput} className="search__button"/>
            </div>
            <button
            onClick={handleAuth} className="user__auth" type="button"><PersonOutlineOutlinedIcon fontSize="large" /><span className="hello__text">Hello</span><span className="user_name">{username}</span></button>
            <Link to="/checkout" className="cart__icon"><span>{productList?.length}</span><LocalGroceryStoreIcon fontSize="medium" htmlColor = "white" /><span>Add to Cart</span></Link>
        </div>
    )
}

const mapStateToProps = state => {
    //console.log("header",state.products)
    return {
        username: state.users
    }
}

export default connect(mapStateToProps, {searchInputAction})(Header);
