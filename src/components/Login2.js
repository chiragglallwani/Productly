import React, {useState} from 'react'
import { connect } from 'react-redux';
import {fetchUsername} from '../store/actions'
import { useHistory } from 'react-router-dom';
import { appleAuth, facebookAuth, googleAuth, auth } from '../firebase/firebase';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@material-ui/icons/Facebook';
import AppleIcon from '@material-ui/icons/Apple';
import { Card } from '@mui/material';
import '../css-styling/login2.css';


export const Login2 = ({fetchUsername}) => {
    const[username, setUsername] = useState('');
    const[userPassword, setUserPassword]  = useState('');

    const history = useHistory();

    const handleSignup = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(username,userPassword).then((userCredential) => {
            /*if(userCredential){
                let user = userCredential.user;
                let name = user.email.substr(0,user.email.indexOf('@'));
                localStorage.setItem('username',name);
                fetchUsername(name);
        }*/
            setUsername("");
            setUserPassword('');
            history.push('/home');
        }).catch(error => alert(error.message));
    }

    const handleLogin = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(username, userPassword).then(userCredential => {
            /*let user = userCredential.user;
            let name = user.email.substr(0,user.email.indexOf('@'));
            localStorage.setItem('username',name);*/
            setUsername("");
            setUserPassword('');
            //fetchUsername(name);
            history.push('/home');
        }).catch(error => alert(error.message));
    }

    const handleSocialMediaLogin = (auth1) => {
        auth.signInWithPopup(auth1).then((result) => {
            /*let name = result.user.email.substr(0,result.user.email.indexOf('@'));
            localStorage.setItem('username',name);
            fetchUsername(name);*/
            history.push('/home');
        }).catch((error) => {
            console.log(error.message);
          });
    }
  return (
    <div className='login-page'>
            <div className='triangle'>
            </div>

            {/*<form className="sign-up-form">
                <h2 className="title">Sign up</h2>
                <div className="input-field">
                    <input value={username} onChange={e  => setUsername(e.target.value)} type="text" placeholder="Username123@example.com"/>
                </div>
                <div className="input-field">
                    <input value={userPassword} onChange={e  => setUserPassword(e.target.value)} type="password" placeholder="password"/>
                </div>
                <input onClick={e => handleSignup(e)} type="submit" value="Sign up" className="btn solid"/>
                <p className="social-text">Or Sign Up with social platform</p>
                <div className="social-media">
                    <a href="#" className="social-icon">
                        <FacebookIcon onClick={() => handleSocialMediaLogin(facebookAuth)}/>
                    </a>
                    <a href="#" className="social-icon">
                        <GoogleIcon onClick={() => handleSocialMediaLogin(googleAuth)}/>
                    </a>
                    <a href="#" className="social-icon">
                        <AppleIcon onClick={() => handleSocialMediaLogin(appleAuth)}/>
                    </a>
                </div>
            </form>

            <form className="sign-in-form">
                <h2 className="title">Sign in</h2>
                <div className="input-field">
                    <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder="Username123@example.com"/>
                </div>
                <div className="input-field">
                    <input value={userPassword} onChange={e  => setUserPassword(e.target.value)}  type="password" placeholder="password"/>
                </div>
                <input onClick={e => handleLogin(e)} type="submit" value="login" className="btn solid"/>
                <p className="social-text">Or Sign in with social platform</p>
                <div className="social-media">
                    <a className="social-icon" href="#" ><FacebookIcon onClick={() => handleSocialMediaLogin(facebookAuth)} /></a>
                    <a className="social-icon" href="#"><GoogleIcon onClick={() => handleSocialMediaLogin(googleAuth)} /></a>
                    <a className="social-icon" href="#" ><AppleIcon onClick={() => handleSocialMediaLogin(appleAuth)} /></a>
                </div>
            </form>*/}


    </div>
  )
}

export default connect(null, {fetchUsername})(Login2)