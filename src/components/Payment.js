import React, { useEffect, useState } from 'react'
import '../css-styling/payment.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import axios from '../API/axios'
import { useHistory } from 'react-router-dom';
import { deleteDataFromDB } from '../store/actions';
import { connect } from 'react-redux';
import CheckoutProduct from './CheckoutProduct';

/**Style for model */
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

function Payment({processing, setProcessing, productList, totalAmount, deleteDataFromDB}) {

    const history = useHistory();

    const [open,setOpen] = useState(false);
    const [houseState, setHouseState] = useState("000");
    const [streetState, setStreetState] = useState("example Street");
    const [postalState, setPostalState] = useState("a0b0c0");
    const [cityState, setCityState] = useState('city123');
    const [provinceState, setProvinceState] = useState("province");

    /* stripe validation state */
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [succeeded, setSucceeded] = useState(false);
    
    const [clientSecret, setClientSecret] = useState('');

    const stripe = useStripe();
    const element = useElements();

    const getClientSecret = async () => {
      const res = await axios({
        method: 'post',
        url: `/payments/create?total=${Math.round(totalAmount*100, 2)}`, //accept in cents if using dollar currency
      }).then((res) => setClientSecret(res.data.clientSecret));
    }

    useEffect(() => {
      getClientSecret();
    }, [productList]);

    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);

    const handleChange = (e) => {
      setDisabled(e.empty);
      setError(e.error ? e.error.message : "");
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setProcessing(true);
      if(clientSecret !== undefined){
        await getClientSecret();
        const payload = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: element.getElement(CardElement)
          }
        }).then(() => {
          //payment confirmation
          setSucceeded(true);
          setError(null);
          setProcessing(false);
          deleteDataFromDB();
          history.replace('/home');
        }).catch(err => console.log(err));
      }
    }


    return (
        <div className="payment">
            <div className="section__top">
                <p>Checkout out: {productList.length} items</p>
            </div>
            <div className="address__section">
                <h4>Address: </h4>
                <div className="customer__address">
                    <p>{houseState}, {streetState}</p>
                    <p>{postalState}</p>
                    <p>{cityState}, {provinceState}</p>
                </div>
                <Button onClick={handleModalOpen}>Change Address</Button>
                <Modal
                    open={open}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                >
            <Box className="modal__window" sx={style}
            autoComple="off"
            >
            <Typography className="modal__title" id="modal-modal-title" variant="h6" component="h2">
            Address for Delivery
          </Typography>
            <TextField className="modal__body" id="outlined-basic" label="Apt No." variant="outlined" defaultValue={houseState}  onChange={e => setHouseState(e.target.value)} />
          <TextField className="modal__body" id="outlined-basic" label="Street Name" variant="outlined"  defaultValue={streetState}  onChange={e => setStreetState(e.target.value)} />
          <TextField className="modal__body" id="outlined-basic" label="Postal Code" variant="outlined"  defaultValue={postalState}  onChange={e => setPostalState(e.target.value)} />
          <TextField className="modal__body" id="outlined-basic" label="City" variant="outlined"  defaultValue={cityState}  onChange={e => setCityState(e.target.value)} />
          <TextField className="modal__body" id="outlined-basic" label="Province" variant="outlined" defaultValue={provinceState}  onChange={e => setProvinceState(e.target.value)} />
          <Button onClick={handleModalClose}>UPDATE</Button>
            </Box>
            </Modal>
            </div>
            <div className="card__section">
                <h5>Payment Method:</h5>
                <div className="card__division">
                  <form onSubmit={handleSubmit} className="card__address">
                      <CardElement onChange={handleChange} options={{
                                    style: {
                                      base: {
                                        fontSize: '12px',
                                        color: '#424770',
                                        '::placeholder': {
                                          color: '#aab7c4',
                                        },
                                      },
                                      invalid: {
                                        color: '#9e2146',
                                      },
                                    },}} />
                      <div className="payment__orderTotal">
                        <p>Order Total: ${totalAmount}</p>
                        <button disabled={processing || disabled || succeeded}>
                          <span>{processing ? <p>Processing</p>: "Buy Now"}</span>
                        </button>
                      </div>
                      {error && <div>{error}</div>}
                  </form>
                </div>
                
            </div>
            <div className="payment__productlist">
              <h5>Review items for delivery:</h5>
              <div className="payment__productitems">{productList.map((product, i) => <CheckoutProduct processing={processing} key={i} product={product}/>)}</div>
            </div>
        </div>
    )
}

export default connect(null , {deleteDataFromDB})(Payment);
