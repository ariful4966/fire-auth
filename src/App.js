import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.cofig';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn:false,
    name:'',
    email:'',
    photo:''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handelSingIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL, email, } = res.user;
      const signInUser ={
        isSignedIn: true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(signInUser);
      // console.log(displayName, photoURL, email);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handelSingOut = () =>{
    firebase.auth().signOut().then(res =>{
      const signOutUser = {
        isSignedIn: false,
        name:'',
        email: '',
        photo:'',
        password:'',
        error:'',
        isValid:false,
        existingUser: false
      }
      setUser(signOutUser);
    })
    .catch(res =>{

    })
  }
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email); 
  const hasNumber = input =>/\d/.test(input);
   
  const switchForm = (e) =>{
    console.log(e.target.checked);
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser (createdUser);
  }


  const handelChange = e =>{
    const newUserInfo = {
      ...user
    };
  
    //perform Validation;
      let isValid = true;
      if(e.target.name === 'email'){
        isValid = is_valid_email(e.target.value);
      }

      if(e.target.name === 'password'){
        isValid = e.target.value.length > 8 && hasNumber(e.target.value);
      }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  // Create Account In User
  const handelCreateAccount = (event) =>{
   
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        console.log(res);
       const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err =>{
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
      
    }
   
    event.preventDefault();
    event.target.reset();
  }
  // Login In User
 const signInUser = (event) =>{
  if(user.isValid){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res =>{
      console.log(res);
     const createdUser = {...user};
      createdUser.isSignedIn = true;
      createdUser.error = '';
      setUser(createdUser);
    })
    .catch(err =>{
      console.log(err.message);
      const createdUser = {...user};
      createdUser.isSignedIn = false;
      createdUser.error = err.message;
      setUser(createdUser);
    })
    
  }
  event.preventDefault();
  event.target.reset();
 }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handelSingOut}>Sign Out</button>: <button onClick={handelSingIn}>Sign In With Google</button>
      }
     {
       user.isSignedIn && <div>
       <p> Welcome, {user.name}</p>
     <p>Your Email : {user.email}</p>
     <img src={user.photo} alt=""/>
       </div>
     }

     <h1>Our Authentication</h1>
     <input type="checkbox" name="switchForm" onChange={switchForm} />
     <label htmlFor="switchForm"> Returning User</label>
     <form onSubmit={signInUser} style={{display:user.existingUser? 'block' : 'none'}} >
      
        <input type="text" onBlur={handelChange} name="email" placeholder="Your Email" required/>
        <br/>
        <input type="password" onBlur={handelChange} name="password" placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="Login"/>
     </form>
     <form onSubmit={handelCreateAccount} style={{display:user.existingUser? 'none' : 'block'} }>
        <input type="text" onBlur={handelChange} name="name" placeholder="Your Name" required/>
        <br/>
        <input type="text" onBlur={handelChange} name="email" placeholder="Your Email" required/>
        <br/>
        <input type="password" onBlur={handelChange} name="password" placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="Sign In"/>
     </form>
     {
       user.error && <p style={{color:'red'}}>{user.error}</p>
     }
    </div>
  );
}

export default App;
