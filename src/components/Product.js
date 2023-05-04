import React from "react";
import { connect } from "react-redux";
import "../css-styling/product.css";
import { addtoCart } from "../store/actions";

function Product({ product, addtoCart }) {
  const sendToCart = (e) => {
    e.preventDefault();
    addtoCart(product);
  };

  return (
    <div className="product__card">
      <div className="product__header">
        <img className="product__image" src={product.thumbnail} alt="product" />
      </div>
      <div className="product__body">
        <h5>{product.title}</h5>
        <p>Price: ${product.price}</p>
      </div>
      <button onClick={sendToCart} className="product__footer">
        Add to Cart
      </button>
    </div>
  );
}

export default connect(null, { addtoCart })(Product);
