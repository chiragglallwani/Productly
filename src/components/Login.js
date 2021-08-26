import React, { useEffect, useState} from 'react'
import EmailIcon from '@material-ui/icons/Email';
import FacebookIcon from '@material-ui/icons/Facebook';
import AppleIcon from '@material-ui/icons/Apple';
import '../css-styling/login.css';
import SignUp from '../assets/undraw_shopping_eii3.png'
import LoginPicture from '../assets/undraw_web_shopping_re_owap.png';
import { appleAuth, facebookAuth, googleAuth, auth } from '../firebase/firebase';
import {fetchUsername} from '../store/actions'
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Login({fetchUsername}) {
    const[username, setUsername] = useState('');
    const[userPassword, setUserPassword]  = useState('');

    const [containerClass, setContainerClass] = useState(false); //css 

    
    
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
        <div className={`container ${containerClass ? 'sign-up-mode' : ''}`}>
            <div className="forms-container">
                <div className="signin-signup">
                    <form className="sign-in-form">
                        <h2 className="title">Sign in</h2>
                        <div className="input-field">
                            <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder="Username123@example.com"/>
                        </div>
                        <div className="input-field">
                            <input value={userPassword} onChange={e  => setUserPassword(e.target.value)}  type="password" placeholder="password"/> {/**start from here.. */}
                        </div>
                        <input onClick={e => handleLogin(e)} type="submit" value="login" className="btn solid"/>
                        <p className="social-text">Or Sign in with social platform</p>
                        <div className="social-media">
                                <a className="social-icon" href="#" >
                                <FacebookIcon onClick={() => handleSocialMediaLogin(facebookAuth)} /></a>
                            <a className="social-icon" href="#"><EmailIcon onClick={() => handleSocialMediaLogin(googleAuth)} /></a>
                            <a className="social-icon" href="#" ><AppleIcon onClick={() => handleSocialMediaLogin(appleAuth)} /></a>
                        </div>
                    </form>


                    <form className="sign-up-form">
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
                                <EmailIcon onClick={() => handleSocialMediaLogin(googleAuth)}/>
                            </a>
                            <a href="#" className="social-icon">
                                <AppleIcon onClick={() => handleSocialMediaLogin(appleAuth)}/>
                            </a>
                        </div>
                    </form>
                </div>
            </div>


            <div className="panels-container">
                <div className="pannel left-panel">
                    <div className="content">
                        <h3>New here?</h3>
                        <p>Make an account to shop the finest product you will ever found on the interent</p>
                        <button onClick={() => setContainerClass(true)} className="btn transparent" id="sign-up-btn">Sign up</button>
                    </div>

                    <img src={SignUp} className="image" alt=""/>
                </div>

                <div className="pannel right-panel">
                    <div className="content">
                        <h3>One of us?</h3>
                        <p>Sign In to shop the latest product based in the best price on the online market.</p>
                        <button onClick={() => setContainerClass(false)} className="btn transparent" id="sign-up-btn">Sign in</button>
                    </div>

                    <img src={LoginPicture} className="image" alt=""/>
                </div>                
            </div>
        </div>
    )
}

export default connect(null, {fetchUsername})(Login)
