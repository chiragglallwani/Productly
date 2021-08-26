import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux';
import '../css-styling/home.css'
import { searchInputAction } from '../store/actions';
import Product from './Product';

function Home({searchInputTerm, searchInputAction, setSearchInput}) {
    const [filterValue, setFilterValue] = useState('');
    const[products, setProducts] = useState([]);

    const handleChange = (event) => {
        setFilterValue(event.target.value);
    }
    useEffect(() => {

        if(filterValue === "" && searchInputTerm === ""){
            axios.get('https://fakestoreapi.com/products').then(res => setProducts(res.data))
        }
        else if(filterValue !== "" && searchInputTerm === ""){
            axios.get(`https://fakestoreapi.com/products/category/${filterValue}`).then(res => setProducts(res.data));
        }
        else if(filterValue !== "" && searchInputTerm !== ""){
            let data = [];
                axios.get(`https://fakestoreapi.com/products/category/${filterValue}`).then(res => 
                    {
                        let  arr = res.data.filter(function(item){
                            return item.title.toUpperCase().includes(searchInputTerm.toUpperCase());
                        })
                        setProducts(arr);
                    }
                );
                console.log(data);
                console.log("Search is not empty:", searchInputTerm);
        }
        else if (filterValue === "" && searchInputTerm !== ""){
            axios.get('https://fakestoreapi.com/products').then(res => {
               let  arr = res.data.filter(function(item){
                    return item.title.toUpperCase().includes(searchInputTerm.toUpperCase());
                })
                setProducts(arr);
            });
        }
    }, [filterValue, searchInputTerm]);
    return (
        <div className="home__page">
            {/**Filter by categories */}

            <div className="filter__section">
                <FormControl component="fieldset">
                    <FormLabel className="filter__header" component="legend" onClick={() => {setFilterValue(''); searchInputAction(''); setSearchInput('')}} style={{cursor: 'pointer'}}>Filter By Categories</FormLabel>
                    <RadioGroup  aria-label="filter-by-categories" name="filter__categories" value={filterValue} onChange={handleChange}>
                    <FormControlLabel className="radio__group" value="electronics" control={<Radio />} label="Electronics" />
                    <FormControlLabel className="radio__group" value="jewelery" control={<Radio />} label="Jwelery" />
                    <FormControlLabel className="radio__group" value="men's clothing" control={<Radio />} label="Men Clothing" />
                    <FormControlLabel className="radio__group" value="women's clothing" control={<Radio />} label="Women Clothing" />
      
                    </RadioGroup>
                </FormControl>
                
            </div>
            {/** DisplayProducts */}

            <div className="product__section">
                    {products.map(product => <Product key={product.id} product={product}/>)}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        searchInputTerm: state.search}
}

export default connect(mapStateToProps, {searchInputAction})(Home);
