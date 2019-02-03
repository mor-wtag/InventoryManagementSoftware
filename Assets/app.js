// Initialize Firebase
var config = {
    apiKey: "AIzaSyAPITJ_b82lngDCMBkqOP4sf28fogy_QMc",
    authDomain: "inventorymanagementsoftware-gp.firebaseapp.com",
    databaseURL: "https://inventorymanagementsoftware-gp.firebaseio.com",
    projectId: "inventorymanagementsoftware-gp",
    storageBucket: "inventorymanagementsoftware-gp.appspot.com",
    messagingSenderId: "451262431109"
};
firebase.initializeApp(config);

// get all elements

const txtemail = $('#UserName_ID');
const txtpassword = $('#Password_ID');
const loginbtn = $('#loginbtn');
const email = $('#UserName_ID');

console.log(txtemail+txtpassword);

// Add login event
$('#loginbtn').click(function () {

    //   Get email and password
    const email = txtemail.value;
    const password = txtpassword.value;
    const auth = firebase.auth();

    //   Sign In
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));

});