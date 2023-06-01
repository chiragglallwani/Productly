import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

function AddressForm({ shippingFormValues, handleShippingFormChange }) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <form noValidate onChange={(e) => handleShippingFormChange(e)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              name="firstname"
              label="First name"
              fullWidth
              variant="standard"
              error={shippingFormValues.firstname.error}
              value={
                shippingFormValues.firstname.value
                  ? shippingFormValues.firstname.value
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastname"
              label="Last name"
              fullWidth
              variant="standard"
              error={shippingFormValues.lastname.error}
              value={
                shippingFormValues.lastname.value
                  ? shippingFormValues.lastname.value
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="address"
              name="address"
              label="Address line"
              fullWidth
              variant="standard"
              error={shippingFormValues.address.error}
              value={
                shippingFormValues.address.value
                  ? shippingFormValues.address.value
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="number"
              required
              id="contact"
              name="contact"
              label="Cell Phone"
              fullWidth
              variant="standard"
              error={shippingFormValues.contact.error}
              value={
                shippingFormValues.contact.value
                  ? shippingFormValues.contact.value
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              name="city"
              label="City"
              fullWidth
              variant="standard"
              error={shippingFormValues.city.error}
              value={
                shippingFormValues.city.value
                  ? shippingFormValues.city.value
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              name="province"
              label="State/Province/Region"
              fullWidth
              variant="standard"
              error={shippingFormValues.province.error}
              value={
                shippingFormValues.province.value
                  ? shippingFormValues.province.value
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="zip"
              name="postcode"
              label="Zip / Postal code"
              fullWidth
              variant="standard"
              error={shippingFormValues.postcode.error}
              value={
                shippingFormValues.postcode.value
                  ? shippingFormValues.postcode.value
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="country"
              name="country"
              label="Country"
              fullWidth
              variant="standard"
              error={shippingFormValues.country.error}
              value={
                shippingFormValues.country.value
                  ? shippingFormValues.country.value
                  : ""
              }
            />
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
}

export default AddressForm;
