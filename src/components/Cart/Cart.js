import { Button, ButtonGroup, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { addToCart, removeFromCart } from "../../store/actions";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import "./cart.scss";

function Cart({
  processing,
  productList,
  totalAmount,
  setOpenCart,
  removeFromCart,
  addToCart,
}) {
  const history = useHistory();

  const removeTheItem = (e, product) => {
    e.preventDefault();
    removeFromCart(product.id);
  };

  const updateQty = (product, qtyUpdate, e) => {
    e.preventDefault();
    addToCart(product, qtyUpdate);
  };

  return (
    <div className="cart">
      <div className="cart__section">
        <div className="cart__header">
          <IconButton size="small" onClick={() => setOpenCart(false)}>
            <CloseIcon />
            <span>Close</span>
          </IconButton>
        </div>
        <Divider />
        <div className="cart__body">
          {productList?.map((product) => (
            <div key={product.id}>
              <div className="cart__product">
                <div className="cart__product__imageWrapper">
                  <img
                    className="cart__product__image"
                    src={product.thumbnail}
                    alt="product-items"
                  />
                </div>
                <div className="cart__product__container">
                  <h4 className="cart__product__category">{product.brand}</h4>
                  <h5 className="cart__product__title">{product.title}</h5>
                  <p className="cart__product__price">
                    Price: ${product.price}
                  </p>
                  <div className="cart__product__footer">
                    <ButtonGroup size="small" className="product__qty__group">
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={product.qty === 1 ? true : false}
                        onClick={(e) => updateQty(product, "REMOVE", e)}
                      >
                        -
                      </Button>
                      <Button size="small" disabled>
                        {product.qty}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={product.qty === 5 ? true : false}
                        onClick={(e) => updateQty(product, "ADD", e)}
                      >
                        +
                      </Button>
                    </ButtonGroup>
                    <button
                      disabled={processing ? true : false}
                      onClick={(e) => removeTheItem(e, product)}
                      className="cart__product__delete__btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </div>
      </div>

      <div className="cart__footer">
        <div className="checkout__total">
          <h4>Total Price:</h4>
          <h4>
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(totalAmount)}
          </h4>
        </div>
        <div className="cart__checkout__btn">
          <button
            disabled={productList?.length === 0 ? true : false}
            onClick={() => {
              history.push("/checkout");
              setOpenCart(false);
            }}
            className="payment__btn"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { addToCart, removeFromCart })(Cart);
