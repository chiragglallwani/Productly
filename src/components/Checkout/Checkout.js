import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import BrandLogo from "../../assets/ProductlyLogo.png";
import { getShippingDetails, submitShippingAddress } from "../../store/actions";
import { connect } from "react-redux";
import { db } from "../../firebase/firebase";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
//const promise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Productly
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const steps = ["Shipping address", "Payment details", "Review your order"];

const theme = createTheme();

const Checkout = ({ submitShippingAddress, userUid }) => {
  const INITIAL_SHIPPING_FORM_STATE = {
    firstname: {
      value: "",
      error: false,
      errorMessage: "Please enter your first name",
    },
    lastname: {
      value: "",
      error: false,
      errorMessage: "Please enter your last name",
    },
    address: {
      value: "",
      error: false,
      errorMessage: "Please enter your Address",
    },
    contact: {
      value: "",
      error: false,
      errorMessage: "Please enter your number",
    },
    city: {
      value: "",
      error: false,
      errorMessage: "Please enter your City",
    },
    province: {
      value: "",
      error: false,
      errorMessage: "Please enter your Province",
    },
    postcode: {
      value: "",
      error: false,
      errorMessage: "Please enter your Postal Code",
    },
    country: {
      value: "",
      error: false,
      errorMessage: "Please enter your Country",
    },
  };

  const INITIAL_PAYMENT_FORM_STATE = {
    cardName: {
      value: "",
      error: false,
      errorMessage: "Please enter the full name on your card",
    },
    cardNumber: {
      value: "",
      error: false,
      errorMessage: "Please enter your card number",
    },
    expDate: {
      value: "",
      error: false,
      errorMessage: "Please enter the expiry date of your card",
    },
    cvv: {
      value: "",
      error: false,
      errorMessage: "Please enter your cvv",
    },
  };

  const [shippingFormValues, setShippingFormValues] = React.useState(
    INITIAL_SHIPPING_FORM_STATE
  );

  const [paymentFormValues, setPaymentFormValues] = React.useState(
    INITIAL_PAYMENT_FORM_STATE
  );

  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(async () => {
    // always make sure your currentUser.uid is defined and its value is there in userUid
    const unsubscribe = db
      .collection("ShoppingUsers")
      .doc(`${userUid}`)
      .get()
      .then((querySnapShot) => {
        const shippingData = querySnapShot.data();
        setShippingFormValues({
          firstname: {
            ...shippingFormValues.firstname,
            value: shippingData?.firstname,
          },
          lastname: {
            ...shippingFormValues.lastname,
            value: shippingData?.lastname,
          },
          address: {
            ...shippingFormValues.address,
            value: shippingData?.address,
          },
          contact: {
            ...shippingFormValues.contact,
            value: shippingData?.contact,
          },
          city: {
            ...shippingFormValues.city,
            value: shippingData?.city,
          },
          province: {
            ...shippingFormValues.province,
            value: shippingData?.province,
          },
          postcode: {
            ...shippingFormValues.postcode,
            value: shippingData?.postcode,
          },
          country: {
            ...shippingFormValues.country,
            value: shippingData?.country,
          },
        });
      });
    return () => unsubscribe();
  }, []);

  const handleShippingFormChange = (e) => {
    const { name, value } = e.target;
    let error = true;
    value !== "" ? (error = false) : (error = true);
    setShippingFormValues({
      ...shippingFormValues,
      [name]: {
        ...shippingFormValues[name],
        value,
        error,
      },
    });
  };

  const handleShippingFormSubmit = async () => {
    const formFields = Object.keys(shippingFormValues);
    let newFormValues = { ...shippingFormValues }; // new State Values

    formFields.map((formField) => {
      const currentField = formField;
      const currentValue = shippingFormValues[currentField].value;

      if (currentValue === "" && currentField !== "address2") {
        newFormValues = {
          ...newFormValues,
          [currentField]: {
            ...newFormValues[currentField],
            error: true,
          },
        };
      }
    });

    setShippingFormValues(newFormValues);
    let formValidate = Object.values(newFormValues).every(
      (element) => element.error === false
    );
    if (formValidate) {
      await submitShippingAddress(newFormValues);
      await setActiveStep(activeStep + 1);
    }
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    let error = true;
    value !== "" ? (error = false) : (error = true);
    setPaymentFormValues({
      ...paymentFormValues,
      [name]: {
        ...paymentFormValues[name],
        value,
        error,
      },
    });
  };

  const handleExpDateValidation = (e) => {};

  const handleCvvValidation = (e) => {};
  const handlePaymentFormSubmit = () => {
    const formFields = Object.keys(paymentFormValues);
    let newFormValues = { ...paymentFormValues }; // new State Values

    formFields.map((formField) => {
      const currentField = formField;
      const currentValue = paymentFormValues[currentField].value;

      if (currentValue === "") {
        newFormValues = {
          ...newFormValues,
          [currentField]: {
            ...newFormValues[currentField],
            error: true,
          },
        };
      }
    });

    setPaymentFormValues(newFormValues);
    let formValidate = Object.values(newFormValues).every(
      (element) => element.error === false
    );
    if (formValidate) {
      setActiveStep(activeStep + 1);
    }
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            shippingFormValues={shippingFormValues}
            handleShippingFormChange={handleShippingFormChange}
          />
        );
      case 1:
        return (
          <PaymentForm
            paymentFormValues={paymentFormValues}
            handlePaymentFormChange={handlePaymentFormChange}
          />
        );
      case 2:
        return <Review />;
      default:
        throw new Error("Unknown step");
    }
  }

  const handleNext = async (e) => {
    if (activeStep === 0) {
      //validate shipping Address and Submit
      e.preventDefault();
      await handleShippingFormSubmit();
    } else if (activeStep === 1) {
      handlePaymentFormSubmit();
    }
    //setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          height: "75px",
          position: "static",
          backgroundColor: "#ff914d",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Link
            sx={{
              fontWeight: "600",
              color: "white",
              fontSize: "2rem",
              margin: "0 1%",
              flex: "0.7",
              textDecoration: "none",
              alignItems: "center",
              justifyContent: "center",
            }}
            href="/home"
          >
            <img
              alt="Brand__logo"
              style={{
                objectFit: "contain",
                width: "10%",
                marginTop: "5px",
                height: "70px",
              }}
              className="brand_logo"
              src={BrandLogo}
            />
          </Link>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={(e) => handleNext(e)}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    userUid: state.users, //auth.currentuser.uid
  };
};

export default connect(mapStateToProps, {
  getShippingDetails,
  submitShippingAddress,
})(Checkout);
