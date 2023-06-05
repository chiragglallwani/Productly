import React from "react";
import { connect } from "react-redux";
import { addToCart } from "../../store/actions";
import { Rating } from "@mui/material";
import { useHistory } from "react-router-dom";
import "./product.scss";

function Product({ product, addToCart }) {
  const history = useHistory();
  const goToProductPage = (e) => {
    e.preventDefault();
    history.push(`/product/${product.id}`);
    //addToCart(product, "ADD");
  };

  return (
    <div onClick={goToProductPage} className="product__card">
      <div className="product__header">
        <img className="product__image" src={product.thumbnail} alt="product" />
      </div>
      <div className="product__body">
        <h5>{product.title}</h5>
        <p className="description" style={{ textOverflow: "ellipsis" }}>
          {product.description}
        </p>
        <p className="rating__container">
          <Rating precision={0.1} value={product.rating} readOnly />
          <span>
            {" "}
            {Intl.NumberFormat("en-US", {}).format(
              Math.floor(Math.random() * (20000 - 1 + 1)) + 1
            )}
          </span>
        </p>
        <p className="price__container">
          Price:
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(product.price)}
        </p>
      </div>
    </div>
  );
}

export default connect(null, { addToCart })(Product);
