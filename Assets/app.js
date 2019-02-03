
console.log("Initiallizing Firebase...");
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAPITJ_b82lngDCMBkqOP4sf28fogy_QMc",
    authDomain: "inventorymanagementsoftware-gp.firebaseapp.com",
    databaseURL: "https://inventorymanagementsoftware-gp.firebaseio.com",
    projectId: "inventorymanagementsoftware-gp",
    storageBucket: "inventorymanagementsoftware-gp.appspot.com",
    messagingSenderId: "451262431109"
};

var initialize = firebase.initializeApp(config);
if (initialize) {
    console.log("Firebase initialized");
}

// get all elements

const txtemail = $('#UserName_ID');
const txtpassword = $('#Password_ID');
const loginbtn = $('#loginbtn');
// const email = $('#UserName_ID');


// Add login event
$('#loginbtn').click(function () {

    console.log("after clicking login button...");

    //   Get email and password
    const email = txtemail.val();
    const password = txtpassword.val();

    console.log("email: " + email);
    console.log("password: " + password);

    const auth = firebase.auth();

    //   Sign In
    const promise = auth.signInWithEmailAndPassword(email, password);
    if (promise) {
        console.log("Successfully Signed in...");

    }
    else {
        alert("Worng Username/ Password. Please Try again.");
        promise.catch(e => console.log(e.message));
    }

});