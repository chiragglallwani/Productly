import React from "react";
import { connect } from "react-redux";
import "../css-styling/product.css";
import { addtoCart } from "../store/actions";
import { Rating } from "@mui/material";

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
        <p className="description" style={{ textOverflow: "ellipsis" }}>
          {product.description}
        </p>
        <p>
          <Rating precision={0.1} value={product.rating} readOnly />
          <span>
            {" "}
            {Intl.NumberFormat("en-US", {}).format(
              Math.floor(Math.random() * (20000 - 1 + 1)) + 1
            )}
          </span>
        </p>
        <p>Price: ${product.price}</p>
      </div>
      <button onClick={sendToCart} className="product__footer">
        Add to Cart
      </button>
    </div>
  );
}

export default connect(null, { addtoCart })(Product);
