import React, { useState } from 'react'
import "./SignUp.css";

const SignUp = (props) => {

    const[inputData,setInputData]=useState({
        email:"",
        password:"",
        confirmPass:""
    })

    function handleData(e){
        let key=e.target.name;
        setInputData({...inputData,[key]:e.target.value});
    }

    function passMatch(){
        return inputData.password===inputData.confirmPass;
    }

    function handleSubmit(e){
        e.preventDefault();
        if(!passMatch()){
            alert("Password do not match");
            return;
        }
        sendData(inputData);
        console.log(inputData);
        setInputData({
            email: "",
            password: "",
            confirmPass: "",
        });
    }

    async function sendData(inputData){
        try{
            const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_AUTHENTICATION_API_KEY}`,{
                method: "POST",
                body: JSON.stringify({
                    email: inputData.email,
                    password: inputData.password,
                    returnSecureToken: true,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data=await response.json();
            console.log(data);
        }
        catch(err){
            console.log(err);
        }

    }


  return (
    <div className='SignUp'>
        <div className='SignUp_Child'>
            <h1>SignUp</h1>
            <form onSubmit={handleSubmit} className='SignUp_form'>
                <input type='Email' placeholder='Email' name='email'
                    onChange={handleData} value={inputData.email} required
                />

                <input type='Password' placeholder='Password'
                name='password'
                onChange={handleData} value={inputData.password} required
                />

                <input type='Password' placeholder='Confirm Password'
                    name='confirmPass'
                    onChange={handleData} value={inputData.confirmPass} required
                />

                <button type='submit'>Sign Up</button>
            </form>
        </div>
        <button onClick={() => props.toggleForm()}>Have an account? Login</button>
    </div>
  )
}

export default SignUp