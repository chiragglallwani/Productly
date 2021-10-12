import React from 'react'
import { connect } from 'react-redux';
import "../css-styling/product.css"
import {removeFromCart} from '../store/actions/index'
function CheckoutProduct({processing, product, removeFromCart}) {

    const removeTheItem = (e) => {
        e.preventDefault();
        removeFromCart(product.id);
    }
    
    return (
        <div className="product__card">
            <div className="product__header">
                <img className="product__image" src={product.image} alt="product-items"/>
            </div>
            <div className="product__body">
                <h5>{product.title}</h5>
                <p>Price: ${product.price}</p>
            </div>
                <button disabled={processing ? true : false} onClick={removeTheItem} className="product__footer">Remove the Item</button>
            
        </div>
    )
}

export default connect(null, {removeFromCart})(CheckoutProduct)
