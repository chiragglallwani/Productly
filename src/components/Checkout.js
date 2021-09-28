import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import "../css-styling/checkout.css";
import CheckoutProduct from './CheckoutProduct';
import { auth, db } from '../firebase/firebase';
import { useHistory } from 'react-router-dom';

function Checkout({ username, newProductList}){

    const [productList, setProductList] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const history = useHistory();
    useEffect(() => {
        const abortController = new AbortController();
        db.collection('users').doc(auth.currentUser?.uid).get().then((doc) => {
            setProductList(doc.data()?.productList);
            setTotalAmount(doc.data()?.totalAmount);
        }).catch(err => console.warn(err));

        return () => {
            abortController.abort();
        }
    },[username, newProductList]);
    //, [username, newProductList]

    useEffect(() => {
        const abortController = new AbortController();
        db.collection('users').doc(auth.currentUser?.uid).get().then((doc) => {
            if(doc.data()){
                setProductList(doc.data()?.productList);
                setTotalAmount(doc.data()?.totalAmount);
            }
        }).catch(err => console.warn(err));

        return () => {
            abortController.abort();
        }
    })


    return (
        <div className="checkout">
            <div className="checkout__productList">
                <p>Hello {username}, Here's your items</p>  
                {productList?.map((product,i) => <CheckoutProduct key={i} product={product}/> )}
            </div>
            <div className="checkout__total">
                <p>Total Items: {productList?.length}</p>
                <p>Total Price: ${totalAmount}</p>
                <p className="total__description">Please make your payment card ready!</p>
                <button disabled={productList?.length ===0 ? true : false} onClick={() => history.push('/payment')} className="payment__button">Proceed for Payment</button>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    //console.log("inside checkout",state.products);
    return {
        username: state.users,
        newProductList: state.products,
    }
}

export default connect(mapStateToProps)(Checkout)
