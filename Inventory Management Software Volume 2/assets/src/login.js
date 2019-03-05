
//this file is to work with the Login.html PAGE portion of authentication

//hide loading function
$('.load-4').hide();

// Initialize Firebase
//SECTION 1 : SETUP FIREBASE
var config = {
    apiKey: "AIzaSyAPITJ_b82lngDCMBkqOP4sf28fogy_QMc",
    authDomain: "inventorymanagementsoftware-gp.firebaseapp.com",
    databaseURL: "https://inventorymanagementsoftware-gp.firebaseio.com/",
    projectId: "inventorymanagementsoftware-gp",
    storageBucket: "inventorymanagementsoftware-gp.appspot.com",
    messagingSenderId: "451262431109"
};

var initialize = firebase.initializeApp(config);


//SECTION 2: CHECK IF USER IS LOGGED IN OR NOT ALREADY
// RealTime listener
//this checks to see if user is logged in 
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //User is logged in, redirect to profile page
        window.location.href= "/index.html";
        console.log("Already Signed in...");
    }
    else {
        //user is not logged in, do nothing
        console.log('Not logged in...');
    }
});

//SECTION 3: ACCEPT LOGIN SUBMIT BUTTON CLICK EVENT
$('input[type="submit"]').click(function () {

    //login loading animation
    $('.login').fadeOut(100);
    $('.load-4').fadeIn(500, function () {
        $('.load-4').fadeOut(1000, function () {
            $('.login').fadeIn(500);
        });
    });


    // get all elements
    const txtemail = $('#UserName_ID');
    const txtpassword = $('#Password_ID');
    const loginbtn = $('#loginbtn');

    // Add login event
    $('#loginbtn').click(function () {

        //   Get email and password
        const email = txtemail.val();
        const password = txtpassword.val();

        const auth = firebase.auth();

        //   Sign In
        const promise = auth.signInWithEmailAndPassword(email, password).then(function (user) {

            alert('Logged in successfully! Redirecting to your profile..');
            window.location.href = "/index.html";

        }, function (err) {

            Error_String = err.code.substr(5);
            alert('Incorrect Username/Password' + ' | Error Code: ' +  Error_String);

        });

    });
});

