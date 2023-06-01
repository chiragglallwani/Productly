import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import { auth, db } from "./firebase/firebase";
//import { fetchUsername } from "./store/actions";
//import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import { Elements } from "@stripe/react-stripe-js";
import UserAdmin from "./components/dashboard/UserAdmin";
import ForgotPassword from "./components/forgotpassword/ForgotPassword";
import UserAccount from "./components/UserAccount/UserAccount";
import Checkout from "./components/Checkout/Checkout";
import { connect } from "react-redux";
import { fetchUsername, authUserUID } from "./store/actions";

function App({ fetchUsername, authUserUID }) {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productList, setProductList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Handle Cart state
  const [openCart, setOpenCart] = useState(false);

  /**Stripe validation */
  const [processing, setProcessing] = useState("");

  useEffect(async () => {
    await auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        db.collection("ShoppingUsers")
          .doc(authUser.uid)
          .onSnapshot((snapshot) => {
            /*fetchUsername(
              snapshot.data()?.firstname ? snapshot.data().firstname : ""
            );*/
            authUserUID(authUser.uid);
          });
        console.log("Auth User", authUser.uid);
        //window.localStorage.setItem('username',name);
      }
    });
  });

  useEffect(() => {
    let componentMounted = true;
    if (componentMounted) {
      auth.onAuthStateChanged((authuser) => {
        if (authuser) {
          const fetchList = async () => {
            try {
              db.collection("ShoppingUsers")
                .doc(auth.currentUser?.uid)
                .onSnapshot((snapshot) => {
                  let products = snapshot.data();
                  if (products !== undefined) {
                    let sortedProductsBasedOnTimeStamp = products.cart.sort(
                      (a, b) => {
                        if (a.createdAt > b.createdAt) {
                          return 1;
                        }
                        if (a.createdAt < b.createdAt) {
                          return -1;
                        }
                        return 0;
                      }
                    );
                    setProductList(sortedProductsBasedOnTimeStamp);
                    setTotalAmount(products.cartTotalAmount);
                  }
                });
            } catch (err) {
              console.log("Error:", err);
            }
          };

          fetchList();
        }
      });
    }
    return () => {
      componentMounted = false;
    };
  }, []);

  const handleCartToggleDrawer = (open, event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setOpenCart(open);
  };

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/forgotpassword">
            <ForgotPassword />
          </Route>

          <Route path="/" exact>
            <Login />
          </Route>

          <Route path="/home">
            <Header
              processing={processing}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              productList={productList}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              openCart={openCart}
              setOpenCart={setOpenCart}
              handleCartToggleDrawer={handleCartToggleDrawer}
            />
            <Home
              processing={processing}
              productList={productList}
              totalAmount={totalAmount}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setSearchInput={setSearchInput}
              openCart={openCart}
              setOpenCart={setOpenCart}
              handleCartToggleDrawer={handleCartToggleDrawer}
            />
          </Route>
          {/*<Route path="/checkout">
            <Header
              processing={processing}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              productList={productList}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              openCart={openCart}
              setOpenCart={setOpenCart}
            />
            <Checkout
              processing={processing}
              productList={productList}
              totalAmount={totalAmount}
            />
  </Route>*/}

          <Route path="/checkout">
            <Checkout />
            {/*<Elements stripe={promise}>
              <Payment
                processing={processing}
                setProcessing={setProcessing}
                productList={productList}
                totalAmount={totalAmount}
              />
</Elements>*/}
          </Route>

          <Route path="/myaccount">
            <UserAccount />
          </Route>

          <Route path="/dashboard">
            <UserAdmin />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default connect(null, { fetchUsername, authUserUID })(App);
