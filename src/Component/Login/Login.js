import React, { useState } from 'react'
import "./Login.css"
import { ThreeCircles } from 'react-loader-spinner';

const Login = (props) => {

    const [inputLogin,setInputLogin]=useState({
        email:"",
        password:""
    })

    const [forgetPass,setForgetPass]=useState(false);
    const [forgetEmail,setForgetEmail]=useState("");
    const [waiting,setWaiting]=useState(false);
    const [finalMsg,setFinalMsg]=useState(false);

    function handleLogin(e){
        let key=e.target.name;
        setInputLogin({...inputLogin,[key]:e.target.value});
    }
    

    async function implementLogin(e){
        e.preventDefault();
        try{
            const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_AUTHENTICATION_API_KEY}`,{
                method: "POST",
                body: JSON.stringify({
                    email: inputLogin.email,
                    password: inputLogin.password,
                    returnSecureToken: true,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                // Check for HTTP error status codes
                const errorData = await response.json();
                throw new Error(errorData.error.message);
            }

            const data=await response.json();
            props.setIdToken(data.idToken);
            
            localStorage.setItem('token', data.idToken);
            props.handleLogin(true);
            console.log("Hello from login");
        }
        catch (err) {
            alert(`Error: ${err.message}`);
            console.log(err);
        }
    }

    function handlePassword(){
        setForgetPass(true);
    }

    async function handleSendLink(){
        setWaiting(true);
        try{
            const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_AUTHENTICATION_API_KEY}`,{
                method: "POST",
                body: JSON.stringify({
                    requestType: "PASSWORD_RESET",
                    email: forgetEmail,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data=await response.json();
            setWaiting(false);
            setFinalMsg(true);
            console.log(data);
        }
        catch(err){
            console.log(err);
        }
    }

  return (
    <div className='login_parent'>
        <>
            {   !forgetPass &&
                <div className='login_child'>
                    <h1>Login</h1>
                    <form onSubmit={implementLogin} className='login_form'>
                        <input type='email' placeholder='Email' 
                        name='email' required
                        onChange={handleLogin} value={inputLogin.email}
                        />
        
                        <input type='password' placeholder='Password' required
                        name='password' onChange={handleLogin} value={inputLogin.password}
                        />
                        <button type='submit'>Login</button>
                    </form>
                    <p onClick={handlePassword}>Forget Password</p>
                </div>
            }
        </>
        <>
        {
            forgetPass && 
            <div>
                {
                   !finalMsg && !waiting && 
                    <>
                        <p>Enter the email which you have registered.</p>
                        <input type='email' placeholder='Email' 
                            onChange={(e)=>setForgetEmail(e.target.value)}
                            value={forgetEmail}
                        />
                        <button onClick={handleSendLink}>Send Link</button>
                    </>
                }
                {   waiting && !finalMsg &&
                    <ThreeCircles
                        visible={true}
                        height="100"
                        width="100"
                        color="#4fa94d"
                        ariaLabel="three-circles-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                }
                {
                    finalMsg && 
                    <p>You would recieve a password reset link in your mail id which you entered above.<br/>
                    Open the link and change the password.</p>
                }
            </div>
        }
        </>

        <button onClick={() => props.toggleForm()}>Have an account? SignUp</button>
    </div>
  )
}

export default Login