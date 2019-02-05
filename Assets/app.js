
console.log("Initiallizing Firebase...");

//hide loading function
$('.load-4').hide();

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAPITJ_b82lngDCMBkqOP4sf28fogy_QMc",
    authDomain: "inventorymanagementsoftware-gp.firebaseapp.com",
    databaseURL: "https://inventorymanagementsoftware-gp.firebaseio.com/",
    projectId: "inventorymanagementsoftware-gp",
    storageBucket: "inventorymanagementsoftware-gp.appspot.com",
    messagingSenderId: "451262431109"
};

var initialize = firebase.initializeApp(config);
if (initialize) {
    console.log("Firebase initialized");
}

// RealTime listener
firebase.auth().onAuthStateChanged( firebaseUser => {
    if (firebaseUser){
        Current_UID = firebaseUser.uid;
        console.log("Already Signed in...");
    }
    else{
        console.log('Not logged in...');
    }
});

$('input[type="submit"]').click(function(){
    $('.login').fadeOut(100);
    $('.load-4').fadeIn(500, function(){
        $('.load-4').fadeOut(1000, function(){
            $('.login').fadeIn(500);
        });
    });
        // $('.login').fadeIn("slow");6000
    // });

    // setTimeout(function(){
    //   $('.load-4').css('display','inline-block').fadeIn();},300);
    // setTimeout(function(){
    //   $(".authent").show();
    // //   $(".authent").animate({opacity: 1},{duration: 200, queue: false }).addClass('visible');
    // },500);
    // setTimeout(function(){
    //   $(".authent").show().animate({right:90},{easing : 'easeOutQuint' ,duration: 600, queue: false });
    //   $(".authent").animate({opacity: 0},{duration: 200, queue: false }).addClass('visible');
    //   $('.login').removeClass('testtwo')
    // },2500);
    // setTimeout(function(){
    //   $('.login').removeClass('test')
    //   $('.login div').fadeOut(123);
    // },2800);

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
    const promise = auth.signInWithEmailAndPassword(email, password).then(function(user){
        Current_UID = user.uid;
        console.log("Logged in successfully...");
    }, function(err) {
        console.log(err.code);
        $("#Login_After_Title").html('Authentication Failed');
        Error_String = err.code.substr(5);
        $("#Login_After_Para").html('Error ID: ' + Error_String) ;
    });

    
    // if (!promise) {
    //     alert("Worng Username/ Password. Please Try again.");
    //     promise.catch(e => console.log(e.message));
    //     }
    // else {
        
    //     window.location.href = "User_page.html";  
    });
});

//Working with Firebase database

const preObject = $('#object');
    
    //Create database references

    const dbRefObject = firebase.database().ref().child('object');

    //Sync Object Changes

    dbRefObject.on('value', snap => {
        preObject.innerText = JSON.stringify(snap.val(), null, 3);
        console.log(snap.val());

    });



