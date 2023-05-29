import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import api from "../../API/axios";
import "./home.scss";
import { searchInputAction } from "../../store/actions";
import Product from "../../components/Product";
import ProductsList from "../../utils/Products.json";

function Home({ searchInputTerm, selectedCategory }) {
  const [products, setProducts] = useState([]);

  useEffect(async () => {
    if (selectedCategory === "" && searchInputTerm === "") {
      try {
        // For Production Purpose
        //await api.get('/read').then(res => setProducts(res.data));

        //For Developement
        setProducts(ProductsList.products);
      } catch (error) {
        console.log(error);
      }
    } else if (selectedCategory !== "" && searchInputTerm === "") {
      // For Production Purpose
      //api.get(`/filter/${filterValue}`).then(res => setProducts(res.data));

      //For Development
      let filterArray = ProductsList.products.filter(function (item) {
        return item.category
          .toUpperCase()
          .includes(selectedCategory.toUpperCase());
      });
      setProducts(filterArray);
    } else if (selectedCategory !== "" && searchInputTerm !== "") {
      // For Production Purpose
      /*api.get(`/filter/${filterValue}`).then(res => 
                    {
                        let  arr = res.data.filter(function(item){
                            return item.title.toUpperCase().includes(searchInputTerm.toUpperCase());
                        })
                        setProducts(arr);
                    }
                );*/

      // For Development
      let filterArray = ProductsList.products.filter(function (item) {
        return (
          item.category
            .toUpperCase()
            .includes(selectedCategory.toUpperCase()) &&
          item.title.toUpperCase().includes(searchInputTerm.toUpperCase())
        );
      });
      setProducts(filterArray);
    } else if (selectedCategory === "" && searchInputTerm !== "") {
      // For Production Purpose
      /*await api.get('/read').then(res => {
               let  arr = res.data.filter(function(item){
                    return item.title.toUpperCase().includes(searchInputTerm.toUpperCase());
                })
                setProducts(arr);
            });*/

      //For Development
      let arr = ProductsList.products.filter(function (item) {
        return (
          item.title.toUpperCase().includes(searchInputTerm.toUpperCase()) ||
          item.description.toUpperCase().includes(searchInputTerm.toUpperCase())
        );
      });
      setProducts(arr);
    }
  }, [selectedCategory, searchInputTerm]);

  return (
    <div className="home__page">
      {/**Filter by categories */}
      <div className="homepage__banner">
        {/*<picture>
          <source media="(min-width: 1024px)" srcSet={HomePageBanner} />
          <source media="(min-width: 414px)" srcSet={HomePageBannerTablet} />
          <img
            className="banner__img"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            src={HomePageBanner}
            alt="Home-Banner"
          />
  </picture>*/}
      </div>
      {/** DisplayProducts */}

      <div className="product__section">
        {products.length !== 0 ? (
          products.map((product) => (
            <Product key={product.id} product={product} />
          ))
        ) : (
          <p style={{ margin: "25% 150%" }}>Loading</p>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    searchInputTerm: state.search,
  };
};

export default connect(mapStateToProps, { searchInputAction })(Home);
