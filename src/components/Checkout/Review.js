import * as React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { deleteDataFromDB, returnPrevOrderNumber } from "../../store/actions";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom/";
import firebase from "firebase";
function Review({
  totalAmount,
  productList,
  shippingFormValues,
  formRef,
  paymentClientSecret,
  deleteDataFromDB,
  setInputInvalid,
  setOrderPlacing,
  userEmail,
  setActiveStep,
  activeStep,
  setOrderNumber,
}) {
  const fullName = `${shippingFormValues.firstname.value} ${shippingFormValues.lastname.value}`;
  const address = `${shippingFormValues.address.value}, ${shippingFormValues.city.value}, ${shippingFormValues.province.value}, ${shippingFormValues.postcode.value}, ${shippingFormValues.country.value}`;
  const stripe = useStripe();
  const element = useElements();
  const history = useHistory();

  const handleChange = (e) => {
    if (e.empty || !e.complete) {
      setInputInvalid(true);
    } else {
      setInputInvalid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit Review");
    if (!stripe || !element) {
      console.log("not stripe or element");
      return;
    }
    setOrderPlacing(true);
    await stripe
      .confirmCardPayment(paymentClientSecret, {
        payment_method: {
          card: element.getElement(CardElement),
          billing_details: {
            name: fullName,
          },
        },
      })
      .then(async () => {
        returnPrevOrderNumber().then((res) => {
          console.log("res", res);
          const orders = {
            orderNumber: res + 1,
            items: productList,
            totalAmount: totalAmount,
            orderAt: firebase.firestore.Timestamp.now(),
          };
          setOrderNumber(res + 1);
          deleteDataFromDB(orders, userEmail, orders.orderNumber);
          setOrderPlacing(false);
          setActiveStep(activeStep + 1);
        });
      })
      .catch((err) => {
        console.log(err);
        history.replace("/checkout");
      });
  };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {productList?.map((product) => (
          <ListItem key={product.id} sx={{ py: 1, px: 0, display: "flex" }}>
            <img
              style={{
                maxHeight: "85px",
                padding: "10px",
                width: "20%",
                height: "80px",
                objectFit: "contain",
              }}
              className="cart__product__image"
              src={product.thumbnail}
              alt="product-items"
            />
            <ListItemText primary={product.title} secondary={product.brand} />
            <Typography variant="body2">${product.price}</Typography>
          </ListItem>
        ))}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${totalAmount}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping Address
          </Typography>
          <Typography gutterBottom>{fullName}</Typography>
          <Typography gutterBottom>{address}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment method
          </Typography>
          <form
            ref={formRef}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <CardElement
              onChange={(e) => handleChange(e)}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
              id="card-element"
            />
          </form>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default connect(null, { deleteDataFromDB })(Review);
