const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const PORT = 3001

const {encrypt, decrypt} = require('./EncryptionHandler')

app.use(cors()); // allows to make connection between two server(frontend & backend) of the same computer
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'passwordmanager'
})

app.post('/addpassword',(req,res) => {
    console.log("in add pass");
    const {password, title} = req.body;
    const hashedPassword = encrypt(password);
    
    db.query("INSERT INTO passwords (password,title,iv) VALUES (?,?,?)",
    [hashedPassword.password, title, hashedPassword.iv],
    (err, result) => {
        if(err){
            console.log(err);
        }
        else{
            res.send("Success");
        }
    }
    );
});

app.post('/updatepassword',(req,res) => {
    console.log("in update function");
    const {password, title, id} = req.body;
    const hashedPassword = encrypt(password);
    db.query("UPDATE passwords SET password = ?, iv = ? WHERE id = ?",
    [hashedPassword.password, hashedPassword.iv, id],
    (err, result) => {
        if(err){
            console.log(err);
        }
        else{
            res.send("Success");
        }
    }
    );
}
);

app.post('/deletepassword',(req,res) => {
    const {id} = req.body;
    db.query("DELETE FROM passwords WHERE id=?",
    [id],
    (err, result) => {
        if(err){
            console.log(err);
        }
        else{
            res.send("Success");
        }
    }
    );
}
);

app.get('/showpassword',(req,res) => {
    db.query('SELECT * FROM passwords;', (err,results) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("results: ", results);
            res.send(results);
        }
    });
});

app.post('/decryptpassword',(req,res) =>{
    res.send(decrypt(req.body));
});

app.listen(PORT, ()=> {
    console.log(("server is running"));
});