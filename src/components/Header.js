import React from 'react'
import '../css-styling/header.css'
import SearchIcon from '@material-ui/icons/Search';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import {connect} from 'react-redux'
import {auth} from '../firebase/firebase';
import { useHistory } from 'react-router-dom';
import { searchInputAction} from '../store/actions';
import {Link} from 'react-router-dom'

function Header({ processing, firstName, searchInputAction, searchInput, setSearchInput, productList}) {
    //const [productList, setProductList] = useState(0);
    const history = useHistory();
    const handleAuth = () => {
        auth.signOut();
        history.push('/')
    }

    const handleSearchinput = () => {
        searchInputAction(searchInput);
    }

    
    return (
        <div className="header">
            <Link className="brand__name" to="/home" aria-disabled={processing ? true : false} onClick={() => { searchInputAction(''); setSearchInput('')}}>Productly</Link>
            <div className="search__bar">
                <input onChange={e => setSearchInput(e.target.value)} value={searchInput} type="text" placeholder="Search product name here..." className="search__input"/>
                <SearchIcon onClick={handleSearchinput} className="search__button"/>
            </div>
            <button disabled={processing ? true: false}
            onClick={handleAuth} className="user__auth" type="button"><PersonOutlineOutlinedIcon fontSize="large" /><span className="hello__text">Hello</span><span className="user_name">{firstName}</span></button>
            <Link aria-disabled={processing ? true : false} to="/checkout" className="cart__icon"><span>{productList?.length}</span><LocalGroceryStoreIcon style={{pointerEvents: `${processing ? 'none': ''}`}} fontSize="medium" htmlColor = "white" /><span>Add to Cart</span></Link>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        firstName: state.users
    }
}

export default connect(mapStateToProps, {searchInputAction})(Header);
