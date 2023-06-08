import React, { useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { auth, db } from "../../firebase/firebase";
import "./userAccount.scss";
import { connect } from "react-redux";
import { submitShippingAddress } from "../../store/actions";

function UserAccount({ submitShippingAddress, userUid }) {
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
  const [showProfile, setShowProfile] = useState(true);
  const [shippingFormValues, setShippingFormValues] = useState(
    INITIAL_SHIPPING_FORM_STATE
  );
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(async () => {
    // always make sure your currentUser.uid is defined and its value is there in userUid
    const unsubscribe = db
      .collection("ShoppingUsers")
      .doc(auth.currentUser?.uid)
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

  const handleShippingFormSubmit = async (e) => {
    e.preventDefault();
    const formFields = Object.keys(shippingFormValues);
    let newFormValues = { ...shippingFormValues }; // new State Values

    formFields.map((formField) => {
      const currentField = formField;
      const currentValue = shippingFormValues[currentField].value;

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

    setShippingFormValues(newFormValues);
    let formValidate = Object.values(newFormValues).every(
      (element) => element.error === false
    );
    if (formValidate) {
      const result = await submitShippingAddress(newFormValues);
      if (result) {
        setOpenSuccessModal(true);
      }
    }
  };

  React.useEffect(async () => {
    // always make sure your currentUser.uid is defined and its value is there in userUid
    const unsubscribe = db
      .collection("ShoppingUsers")
      .doc(`${userUid}`)
      .get()
      .then((querySnapShot) => {
        const shippingData = querySnapShot.data();
        setOrderHistory(shippingData?.orders);
      });
    return () => unsubscribe();
  }, []);

  return (
    <div className="user__account">
      <aside className="sidebar">
        <header className="sidebar-header">
          <p>My Profile</p>
        </header>
        <nav>
          <Button
            onClick={() => setShowProfile(true)}
            sx={{ textTransform: "none", color: "inherit" }}
          >
            <IconButton>
              <AccountCircleOutlinedIcon />
            </IconButton>
            <span>Profile</span>
          </Button>
          <Button
            onClick={() => setShowProfile(false)}
            sx={{ textTransform: "none", color: "inherit" }}
          >
            <IconButton>
              <ShoppingBagOutlinedIcon />
            </IconButton>
            <span>Orders</span>
          </Button>
        </nav>
      </aside>
      <div className="user__accountMain">
        {showProfile ? (
          <div className="profile__container">
            <h2 className="profile__header">Personal Details</h2>
            <form
              className="form"
              noValidate
              onChange={(e) => handleShippingFormChange(e)}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="firstName"
                    name="firstname"
                    label="First name"
                    fullWidth
                    variant="outlined"
                    color="info"
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
                    variant="outlined"
                    color="info"
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
                    variant="outlined"
                    color="info"
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
                    variant="outlined"
                    color="info"
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
                    variant="outlined"
                    color="info"
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
                    variant="outlined"
                    color="info"
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
                    variant="outlined"
                    color="info"
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
                    variant="outlined"
                    color="info"
                    error={shippingFormValues.country.error}
                    value={
                      shippingFormValues.country.value
                        ? shippingFormValues.country.value
                        : ""
                    }
                  />
                </Grid>
              </Grid>
              <Button
                sx={{ marginTop: "20px", float: "right" }}
                color="success"
                variant="contained"
                size="medium"
                onClick={(e) => handleShippingFormSubmit(e)}
              >
                Update Profile
              </Button>
              <Button
                sx={{ marginTop: "20px", float: "right", marginRight: "10px" }}
                variant="outlined"
                onClick={() =>
                  setShippingFormValues(INITIAL_SHIPPING_FORM_STATE)
                }
              >
                Cancel
              </Button>
            </form>
          </div>
        ) : (
          <div className="orders">
            <h3 className="order__header">My Orders</h3>
            <Paper
              variant="secondary"
              sx={{ width: "100%", overflow: "hidden" }}
            >
              <TableContainer sx={{ maxHeight: "80%" }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        key="order"
                        align="left"
                        style={{ minWidth: "100%" }}
                      >
                        Order Number
                      </TableCell>
                      <TableCell
                        key="Products"
                        align="left"
                        style={{ minWidth: "100%" }}
                      >
                        Products
                      </TableCell>
                      <TableCell
                        key="TotalAmount"
                        align="left"
                        style={{ minWidth: "100%" }}
                      >
                        TotalAmount
                      </TableCell>
                      <TableCell
                        key="Date"
                        align="left"
                        style={{ minWidth: "100%" }}
                      >
                        Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderHistory?.map((row) => (
                      <TableRow>
                        <TableCell
                          key={row.orderNumber}
                          align="left"
                          style={{ minWidth: "100%" }}
                        >
                          #{row.orderNumber}
                        </TableCell>
                        <TableCell
                          key={row.items.length}
                          align="left"
                          style={{ minWidth: "100%" }}
                        >
                          {`${row.items.length} items`}
                        </TableCell>
                        <TableCell
                          key={row.totalAmount}
                          align="left"
                          style={{ minWidth: "100%" }}
                        >
                          {Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(row.totalAmount)}
                        </TableCell>
                        <TableCell
                          key={row.orderAt.toDate().toString()}
                          align="left"
                          style={{ minWidth: "100%" }}
                        >
                          {new Date(
                            row.orderAt.toDate().toString()
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={orderHistory.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        )}
      </div>

      <Dialog
        onClose={() => setOpenSuccessModal(false)}
        open={openSuccessModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {openSuccessModal ? (
            <IconButton
              aria-label="close"
              onClick={() => setOpenSuccessModal(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 0,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Your Address is updated successfully!
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userUid: state.users, //auth.currentuser.uid
  };
};

export default connect(mapStateToProps, { submitShippingAddress })(UserAccount);
