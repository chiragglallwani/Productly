import * as React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";

const products = [
  {
    name: "Product 1",
    desc: "A nice thing",
    price: "$9.99",
  },
  {
    name: "Product 2",
    desc: "Another thing",
    price: "$3.45",
  },
  {
    name: "Product 3",
    desc: "Something else",
    price: "$6.51",
  },
  {
    name: "Product 4",
    desc: "Best thing of all",
    price: "$14.11",
  },
  { name: "Shipping", desc: "", price: "Free" },
];

const addresses = ["1 MUI Drive", "Reactville", "Anytown", "99999", "USA"];

export default function Review({
  totalAmount,
  productList,
  paymentFormValues,
  shippingFormValues,
  cardType,
}) {
  const fullName = `${shippingFormValues.firstname.value} ${shippingFormValues.lastname.value}`;
  const address = `${shippingFormValues.address.value}, ${shippingFormValues.city.value}, ${shippingFormValues.province.value}, ${shippingFormValues.postcode.value}, ${shippingFormValues.country.value}`;

  const payments = [
    { name: "Card type", detail: cardType },
    { name: "Card holder", detail: paymentFormValues.cardName.value },
    {
      name: "Card number",
      detail:
        paymentFormValues.cardNumber.value.slice(0, -4).replace(/./g, "X") +
        paymentFormValues.cardNumber.value.slice(-4),
    },
    { name: "Expiry date", detail: paymentFormValues.expDate.value },
  ];

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
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          <Typography
            gutterBottom
          >{`${shippingFormValues.firstname.value} ${shippingFormValues.lastname.value}`}</Typography>
          <Typography gutterBottom>{address}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
