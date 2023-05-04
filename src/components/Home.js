import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import api from "../API/axios";
import "../css-styling/home.css";
import { searchInputAction } from "../store/actions";
import Product from "./Product";
import ProductsList from "../utils/Products.json";

function Home({ searchInputTerm, searchInputAction, setSearchInput }) {
  const [filterValue, setFilterValue] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleChange = (event) => {
    setFilterValue(event.target.value);
  };

  useEffect(async () => {
    if (categories.length === 0) {
      try {
        // For Production Purpose
        await api
          .get("/readOnlyCategory")
          .then((res) => setCategories(res.data));
      } catch (error) {
        console.log(error);
      }
    }

    if (filterValue === "" && searchInputTerm === "") {
      try {
        // For Production Purpose
        //await api.get('/read').then(res => setProducts(res.data));

        //For Developement
        setProducts(ProductsList.products);
      } catch (error) {
        console.log(error);
      }
    } else if (filterValue !== "" && searchInputTerm === "") {
      // For Production Purpose
      //api.get(`/filter/${filterValue}`).then(res => setProducts(res.data));

      //For Development
      let filterArray = ProductsList.products.filter(function (item) {
        return item.category.toUpperCase().includes(filterValue.toUpperCase());
      });
      setProducts(filterArray);
    } else if (filterValue !== "" && searchInputTerm !== "") {
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
          item.category.toUpperCase().includes(filterValue.toUpperCase()) &&
          item.title.toUpperCase().includes(searchInputTerm.toUpperCase())
        );
      });
      setProducts(filterArray);
    } else if (filterValue === "" && searchInputTerm !== "") {
      // For Production Purpose
      /*await api.get('/read').then(res => {
               let  arr = res.data.filter(function(item){
                    return item.title.toUpperCase().includes(searchInputTerm.toUpperCase());
                })
                setProducts(arr);
            });*/

      //For Development
      let arr = ProductsList.products.filter(function (item) {
        return item.title.toUpperCase().includes(searchInputTerm.toUpperCase());
      });
      setProducts(arr);
    }
  }, [filterValue, searchInputTerm]);

  return (
    <div className="home__page">
      {/**Filter by categories */}

      <div className="filter__section">
        <FormControl component="fieldset">
          <FormLabel
            className="filter__header"
            component="legend"
            onClick={() => {
              setFilterValue("");
              searchInputAction("");
              setSearchInput("");
            }}
            style={{ cursor: "pointer" }}
          >
            Filter By Categories
          </FormLabel>
          <RadioGroup
            aria-label="filter-by-categories"
            name="filter__categories"
            value={filterValue}
            onChange={handleChange}
          >
            {categories.map((categoryName) => (
              <FormControlLabel
                key={categoryName}
                className="radio__group"
                value={categoryName}
                control={<Radio />}
                label={categoryName}
              />
            ))}
          </RadioGroup>
        </FormControl>
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
