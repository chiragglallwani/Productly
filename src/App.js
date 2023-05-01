import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Login from './components/Login';
import Home from './components/Home';
import { auth, db } from './firebase/firebase';
import { fetchUsername } from './store/actions';
import { connect } from 'react-redux';
import Checkout from './components/Checkout';
import Payment from './components/Payment';
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js';
import Login2 from './components/Login2';


const promise = loadStripe('pk_test_51Hd8tDDdwnwgCXY0n33CYFmWHxZAcpGED08SomyY9NZmA6Ji9oounkhZhEmXzPNcAhPbrRzNAeGtFqZY59TUSSiU0049j6KUoK');

function App({fetchUsername}) {
    const [searchInput, setSearchInput] = useState('');
    const [productList, setProductList] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    /**Stripe validation */
    const [processing, setProcessing] = useState("");

    useEffect(() => {
        auth.onAuthStateChanged(authUser => {
            if(authUser){
                let name = authUser.email.substr(0,authUser.email.indexOf('@'));
                fetchUsername(name);
                //window.localStorage.setItem('username',name);
            }
        })
    });

    useEffect(() => {
        let componentMounted = true;
        if(componentMounted){
            auth.onAuthStateChanged(authuser => {
                if(authuser){
                    const fetchList = async () => {
                        try{
                            db.collection('users').doc(auth.currentUser?.uid).onSnapshot(snapshot => {
                                let products = snapshot.data();
                                if(products !== undefined){
                                    setProductList(products.productList);
                                 setTotalAmount(products.totalAmount);
                                }
                                //console.log("products",products)
                            });
                        }catch(err) {
                            console.log("Error:", err);
                        }
                    }

                    fetchList();
                }
            })
        }
        return () => {
            componentMounted = false;
        }
    }, [])

    return (
        <Router>
            <div className="app">

            <Switch>
                <Route path="/" exact>
                    <Login />
                </Route>
                <Route path="/home">
                    <Header processing={processing} searchInput={searchInput} setSearchInput={setSearchInput} productList={productList}/>
                    <Home setSearchInput={setSearchInput}/>
                </Route>
                <Route path="/checkout">
                    <Header processing={processing} searchInput={searchInput} setSearchInput={setSearchInput} productList={productList}/>
                    <Checkout processing={processing} productList={productList} totalAmount={totalAmount} />
                </Route>

                <Route path="/payment">
                    <Header processing={processing} searchInput={searchInput} setSearchInput={setSearchInput} productList={productList}/>
                    <Elements stripe={promise}>
                        <Payment processing={processing} setProcessing={setProcessing} productList={productList} totalAmount={totalAmount}/>
                    </Elements>
                </Route>
                <Route path="/login2">
                    <Login2 />
                </Route>

            </Switch>
            </div>
        </Router>
    )
}

const mapStateToProps = state => {
    console.log("App.js", state.products);
    return {
        products: state.products,
    }
}

export default connect(null, {fetchUsername})(App)
