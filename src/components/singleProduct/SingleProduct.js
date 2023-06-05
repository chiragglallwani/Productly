import React, { useEffect, useState } from "react";
import "./singleProduct.scss";
import { useParams } from "react-router-dom";
import ProductsList from "../../utils/Products.json";
import api from "../../API/axios";
import { Box, Button, CircularProgress, Rating } from "@mui/material";
import ReactImageMagnify from "react-image-magnify";
import { connect } from "react-redux";
import { addToCart } from "../../store/actions";

function SingleProduct({ addToCart }) {
  const { id } = useParams();
  //location.pathname
  const [product, setProduct] = useState();
  const [productPageLoading, setProductPageLoading] = useState(false);
  const [magnifierImage, setMagnifierImage] = useState(null);
  useEffect(async () => {
    setProductPageLoading(true);
    //For Production
    //api.get(`/readSingleProduct?id=${id}`).then((res) => setProduct(res.data));

    //For Development
    setProduct(ProductsList.products[id - 1]);
    setProductPageLoading(false);
  }, []);

  const sendToCart = (e) => {
    e.preventDefault();
    addToCart(product, "ADD");
  };

  const returnRender = productPageLoading ? (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  ) : (
    <div className="single__product">
      <div className="product__container">
        <div className="image__container">
          <div className="image__list">
            {product?.images.map((img, index) => (
              <Button
                key={index}
                onClick={() => setMagnifierImage(product?.images[index])}
              >
                <img className="images" src={img} alt={index} />
              </Button>
            ))}
          </div>
          <div className="image__magnifier">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Wristwatch by Ted Baker London",
                  isFluidWidth: true,
                  src:
                    magnifierImage === null
                      ? product?.images[0]
                      : magnifierImage,
                },
                largeImage: {
                  src:
                    magnifierImage === null
                      ? product?.images[0]
                      : magnifierImage,
                  width: 2000,
                  height: 2000,
                },
              }}
            />
          </div>
        </div>
        <div className="data__container">
          <div className="data__header">
            <h4 className="data__brand">{product?.brand}</h4>
            <h2 className="data__title">{product?.title}</h2>
          </div>
          <div className="data__body">
            <Rating
              sx={{ zIndex: -5 }}
              precision={0.1}
              value={product?.rating || null}
              readOnly
            />
            <p className="data__description">{product?.description}</p>
          </div>
          <div className="data__footer">
            {product?.discountPercentage ? (
              <div>
                Price:{" "}
                <span className="before__price">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(
                    product?.price / (1 - product?.discountPercentage / 100)
                  )}
                </span>
              </div>
            ) : (
              <></>
            )}
            <span className="price">
              Price:{" "}
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product?.price)}
              <p className="discount__percentage">
                {product?.discountPercentage}% discount on this product. HURRY
                UP!
              </p>
            </span>
            <button className="addCart__button" onClick={sendToCart}>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return returnRender;
}

export default connect(null, { addToCart })(SingleProduct);
