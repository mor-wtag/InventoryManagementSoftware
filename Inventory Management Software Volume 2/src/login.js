
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
        window.location.href = "./index.html";
        console.log("Already Signed in...");
    }
    else {
        //user is not logged in, do nothing
        console.log('Not logged in...');
    }
});

//---LOG IN PAGE---
//SECTION 3: ACCEPT LOGIN SUBMIT BUTTON CLICK EVENT

// Add login event
$('#loginbtn').click(function () {

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

    //Get email and password
    const email = txtemail.val();
    const password = txtpassword.val();

    const auth = firebase.auth();

    //Sign In
    const promise = auth.signInWithEmailAndPassword(email, password);

    promise.then(function (user) {

        alert('Logged in successfully! Redirecting to your profile..');
        window.location.href = "../index.html";

    }, function (err) {

        Error_String = err.code.substr(5);
        alert('Incorrect Username/Password' + ' | Error Code: ' + Error_String);
        window.location.reload();
        return false;
    });
});

//---SIGN UP PAGE---
//On clicking Sign up button, display the signup bar and remove the Login Bar
$("#newAccountBtn").click(function () {

    $('#login_wrapper').css('display', 'none');
    $('#signUp_wrapper').css('display', 'inline-block');

    //on submitting sign up form
    //clicking the Sign up button

    $("#signUpbtn").click(function () {

        //take values of the input fields
        let signup_userID = $("#signup_user").val();
        let signup_password = $("#signup_password").val();
        let signup_identification_key = $("#signup_identification_key").val();

        const auth = firebase.auth();

        console.log("signup_userID: " + signup_userID);
        console.log("signup_password: " + signup_password);
        console.log("signup_identification_key: " + signup_identification_key);

        //IMPORTANT
        //if a new user wants to sign in, they have to know the identification Key. Identification key is hardcoded for now
        let identificationKey = 'REM123';

        //check if identification key is the same as the user entered
        if (signup_identification_key == identificationKey) {


            let signup_promise = firebase.auth().createUserWithEmailAndPassword(signup_userID, signup_password);

            signup_promise.then(function (user) {

                alert('Sign up successful! Redirecting to your profile..');
                window.location.href = "../index.html";

            }, function (err) {

                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorCode);
                console.log(errorMessage);

                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                } else {
                    alert(errorMessage);
                }

            });

            // });
            //   signup_promise.then(function(user){
            //     console.log(user);
            //     alert("User Aunthication Varified! New account created.");
            //     window.location.href= "./index.html";
            //     return false;
            //   });
        }
        else {
            alert("Sign up credentials not varified! Please check if the Identification Key is correct");
        }
    });
});



// promise.then(function(){

// }, function(err){

//    console.log(err.code)

// });

// promise.then(function(){

// }, function(err){

// })
