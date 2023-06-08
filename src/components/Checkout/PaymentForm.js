import * as React from "react";
import Typography from "@mui/material/Typography";
import { PaymentElement } from "@stripe/react-stripe-js";

export default function PaymentForm({ handleStripePaymentForm }) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <form onSubmit={handleStripePaymentForm}>
        <PaymentElement id="payment-element" />
        {/*<Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cardName"
              name="cardName"
              label="Name on card"
              fullWidth
              variant="standard"
              error={paymentFormValues.cardName.error}
              value={
                paymentFormValues.cardName.value
                  ? paymentFormValues.cardName.value
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              type="number"
              id="cardNumber"
              name="cardNumber"
              label="Card number"
              fullWidth
              helperText="ex: 4242424242424242 for Testing"
              error={paymentFormValues.cardNumber.error}
              value={
                paymentFormValues.cardNumber.value
                  ? paymentFormValues.cardNumber.value
                  : ""
              }
              sx={{
                "input[type='number']::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                },
                "input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                },
                "input[type='number']": { MozAppearance: "textfield" },
              }}
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="expDate"
              name="expDate"
              label="Expiry date"
              fullWidth
              helperText="MM/YY"
              //onChange={(e) => handleExpDateValidation(e.target.value)}
              error={paymentFormValues.expDate.error}
              value={
                paymentFormValues.expDate.value
                  ? paymentFormValues.expDate.value
                  : ""
              }
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cvv"
              name="cvv"
              label="CVV"
              sx={{
                "input[type='number']::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                },
                "input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                },
                "input[type='number']": { MozAppearance: "textfield" },
              }}
              helperText="Last three digits on signature strip"
              fullWidth
              error={paymentFormValues.cvv.error}
              value={
                paymentFormValues.cvv.value ? paymentFormValues.cvv.value : ""
              }
              variant="standard"
              type="password"
            />
          </Grid>
          {/*<Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            label="Remember credit card details for next time"
          />
  </Grid>*/}
        {/*</Grid>*/}
      </form>
    </React.Fragment>
  );
}
