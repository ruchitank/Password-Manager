import './App.css';
import { useState, useEffect } from "react";
import Axios from 'axios';

function App() {

  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [passwordList, setPasswordList] = useState([])

  useEffect(() => {
    Axios.get('http://localhost:3001/showpassword').
    then((response) => {
      console.log("data:" , response.data);
      setPasswordList(response.data);
    }).
    catch(err => console.log('Login: ', err));
  },[]);

  const addPassword = () => {
    Axios.post('http://localhost:3001/addpassword', {
      password: password,
      title: title
    }).then(res => console.log(res))
    .catch(err => console.log('Login: ', err));
  };

  const decryptPassword = (encryption) => {
    console.log("val: ", encryption);
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id == encryption.id
            ? {
                id: val.id,
                password: val.password,
                title: val.title,
                iv: val.iv,
                data: val.data == undefined || val.data == "" ? " : " + response.data : "",
              }
            : val;
        })
      );
    });
  };

  
  return (
    <div className="App">
      <div className='AddingPassword'>
        <input type='text' placeholder='Example: password123' 
        onChange={(event) => {
          setPassword(event.target.value);
          }}
        />
        <input type='text' placeholder='Example: Facebook'
        onChange={(event) => {
          setTitle(event.target.value);
          }}
        />
        <button onClick={addPassword}>Add Password</button>
      </div>

      <div className='Passwords'>
        {passwordList.map((val,key) => {
          return (
            <div className='password' 
                 onClick={() => {
                 decryptPassword({password: val.password, iv: val.iv, id: val.id})
              }}
              key={key}
            >  
              <h3>{val.title}</h3>
              <h3>{val.data}</h3>
            </div>) 
        })
        }
      </div>
    </div>
  );
}

export default App;
