import React, { useState } from 'react';
import './LoginSignup.css';

function LoginSignupPage() {
    const [isActive, setIsActive] = useState(false);

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    return (
        <div className={`container ${isActive ? 'active' : ''}`} id="container">
            <FormContainer isSignUp={true} handleToggle={handleToggle} />
            <FormContainer isSignUp={false} handleToggle={handleToggle} />
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome To FlixNestle <br /><span className="text">Experience Cinema Like Never Before</span></h1>
                        <p>Sign in With ID & Password</p>
                        <button className="hidden" onClick={handleToggle}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hi Movie Lover's</h1>
                        <p>Your Movie Journey Starts Here</p>
                        <button className="hidden" onClick={handleToggle}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormContainer({ isSignUp, handleToggle }) {
    return (
        <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
            <form>
                <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
                <div className="social-icons">
                    <button className="social-icon">
                        <i className="bx bxl-google"></i>
                    </button>
                    <button className="social-icon">
                        <i className="fab fa-google"></i>
                    </button>
                    <button className="social-icon">
                        <i className="fab fa-twitter"></i>
                    </button>
                </div>
                <span>{isSignUp ? 'Register with E-mail' : 'Login With Email & Password'}</span>
                {isSignUp && <input type="text" placeholder="Name" />}
                <input type="email" placeholder="Enter E-mail" />
                <input type="password" placeholder="Enter Password" />
                {!isSignUp && <button className="link-button">Forget Password?</button>}
                <button type="button" onClick={handleToggle}>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}

export default LoginSignupPage;