
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
        alert('Logged in successfully');
    }, function(err) {
        console.log(err.code);
        $("#Login_After_Title").html('Authentication Failed');
        Error_String = err.code.substr(5);
        $("#Login_After_Para").html('Error ID: ' + Error_String) ;
        alert('Incorrect Username/Password');
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

// const preObject = $('#object');
// const ulList = $('#list');
const dbObject = $('#databaseTable');
    
    //Create database references

    const dbRefObject = firebase.database().ref().child('Database'); //children of database object (sl)
    const dbRefElement = dbRefObject.child('sl'); //children of sl object (01)


    //Sync Object Changes

    //if value changes of the '01' object

    dbRefElement.on('value', snap => {
        // dbObject.html(JSON.stringify(snap.val(), null, 3));
        // console.log(snap.val());
    });

    //Snyc database changes

    dbRefElement.on('child_added', snap => {

        //referencing all the child elements into variables

        let sl = snap.child("sl").val();
        let itemDes = snap.child("itemDes").val();
        let uom = snap.child("uom").val();
        let qty = snap.child("qty").val();
        let rate_incTax = snap.child("rate_incTax").val();
        let vat = snap.child("vat").val();
        let rate_incVatTax = snap.child("rate_incVatTax").val();
        let totalAmount = snap.child("totalAmount").val();
        let contractNo_main = snap.child("contractNo_main").val();
        let vendor_main = snap.child("vendor_main").val();
        let contractNo_novated = snap.child("contractNo_novated").val();
        let date_BOQ = snap.child("date_BOQ").val();
        let orderNo = snap.child("orderNo").val();
        let prNo = snap.child("prNo").val();
        let date_PR = snap.child("date_PR").val();

        //appending elements into the databaseTable

        $('#databaseTable').append("<tr><td>"+sl+"</td><td>"+itemDes+"</td><td>"+uom+"</td><td>"+qty+"</td><td>"+rate_incTax+"</td><td>"+vat+"</td><td>"+rate_incVatTax+"</td><td>"+totalAmount+"</td><td>"+contractNo_main+"</td><td>"+vendor_main+"</td><td>"+contractNo_novated+"</td><td>"+date_BOQ+"</td><td>"+orderNo+"</td><td>"+prNo+"</td><td>"+date_PR+"</td></tr>")

        
        console.log('itemDes: '+itemDes);
        console.log('orderNo: '+orderNo);
        console.log('contractNo_novated: '+contractNo_novated);

        // dbObject.html(JSON.stringify(snap.val(), null, 3));

        console.log(snap.val());
    });

    //binding the 'Create new Entry' button

        //Get elements
        let uploader = $('#uploader_BOQ');
        let fileButton = $('#fileButton_BOQ')

        //Listen for file selection
        fileButton.addEventListener('change', function(e){

            // Get File
            var file = e.target.files[0];

            // Create Storage bar
            let storageRef = firebase.storage().ref('BOQ/' + file.name)


            // Upload file


            // Update storage bar

        }



