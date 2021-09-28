import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Login from './components/Login';
import Home from './components/Home';
import { auth } from './firebase/firebase';
import { fetchUsername } from './store/actions';
import { connect } from 'react-redux';
import Checkout from './components/Checkout';
import Payment from './components/Payment';

function App({fetchUsername}) {
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged(authUser => {
            if(authUser){
                let name = authUser.email.substr(0,authUser.email.indexOf('@'));
                fetchUsername(name);
                //window.localStorage.setItem('username',name);
            }
        })
    });

    return (
        <Router>
            <div className="app">

                <Switch>
                <Route path="/" exact>
                <Login 
                
                />
            </Route>
            <Route path="/home">
                <Header searchInput={searchInput} setSearchInput={setSearchInput}/>
                <Home setSearchInput={setSearchInput}/>
            </Route>
            <Route path="/checkout">
                <Header searchInput={searchInput} setSearchInput={setSearchInput}/>
                <Checkout/>
            </Route>

            <Route path="/payment">
                <Header/>
                <Payment/>
            </Route>


                </Switch>
            </div>
        </Router>
    )
}

export default connect(null, {fetchUsername})(App)
