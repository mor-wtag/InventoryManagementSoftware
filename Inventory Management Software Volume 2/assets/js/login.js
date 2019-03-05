
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
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        Current_UID = firebaseUser.uid;
        console.log("Already Signed in...");
    }
    else {
        console.log('Not logged in...');
    }
});

$('input[type="submit"]').click(function () {
    $('.login').fadeOut(100);
    $('.load-4').fadeIn(500, function () {
        $('.load-4').fadeOut(1000, function () {
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
        const promise = auth.signInWithEmailAndPassword(email, password).then(function (user) {
            Current_UID = user.uid;
            console.log("Logged in successfully...");
            alert('Logged in successfully');
        }, function (err) {
            console.log(err.code);
            $("#Login_After_Title").html('Authentication Failed');
            Error_String = err.code.substr(5);
            $("#Login_After_Para").html('Error ID: ' + Error_String);
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

//Uploading BOQ and storing it in the database

//Get elements
let uploader = $('.uploader');
let submitBOQ = $('#submit_boq');
var file;

// Add events
$('#form_boq').submit(function(e){
    
    // Get File
    file = e.target.files;

    console.log(file);

    var ExcelToJSON = function() {

        this.parseExcel = function(file) {
          var reader = new FileReader();
      
          reader.onload = function(e) {
            var data = e.target.result();
            var workbook = XLSX.read(data, {
              type: 'binary'
            });
      
            workbook.SheetNames.forEach(function(sheetName) {
              // Here is your object
              var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              var json_object = JSON.stringify(XL_row_object);
              console.log(json_object);
            });
          };
      
          reader.onerror = function(ex) {
            console.log(ex);
          };
      
          reader.readAsBinaryString(file);
        };
    };
});



//Listen for file selection
// fileButton.change(function (e) {
//     console.log("Attempting to upload a file...");
//     // Get File
//     let file = e.target.files[0];

//     console.log(file);

//     let fileName = file.name

//     // Create Storage bar
//     let storageRef = firebase.storage().ref('BOQ/' + fileName);

//     // Upload file
//     let task = storageRef.put(file);

//     // Update storage bar
//     task.on("state_changed",
//         function progress(snapshot) {
//             console.log('Inside Progress bar');
//             var percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//             uploader.value = percentage;
//             console.log('percentage = ' + percentage);
//             console.log('Uploader value = ' + uploader.value);
//         },
//         function error(err) {

//         },
//         // function complete() {
//         //     alert('File Successfully Uploaded!');
//         // },
//         function gettingDownloadURL() {
//             // Upload completed successfully, now we can get the download URL
//             task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
//             console.log('File available at'+ downloadURL);

//               //convert the csv file to json
//             });
//     });
//   });


//     //Get download URL of Excel Uploaded files

//         let boq_downloadLink = firebase.storage().ref('BOQ/'+fileName);
//         boq_downloadLink.getDownloadURL().then(function(url) {
//             console.log("url: "+url);
//     });

//Database reference

const dbRefObject = firebase.database().ref().child('databases'); //children of database object
const dbRefElement = dbRefObject.child('new_Entry'); //children of database object

//submit form

$(document).ready(function () {

    $("#submit_newEntry").click(function () {

        //saving the values of the form from the front end

        let itemCode = $("#itemCode").val();
        let itemName = $("#itemName").val();
        let uom = $("#uom").val();
        let quantity = $("#quantity").val();
        let unitRate = $("#unitRate").val();
        let totalAmount = $("#totalAmount").val();
        let mainContract = $("#mainContract").val();
        let mainVendor = $("#mainVendor").val();
        let novatedContract = $("#novatedContract").val();
        let novatedVendor = $("#novatedVendor").val();
        let PRnum = $("#PRnum").val();
        let POnum = $("#POnum").val();
        let delChalNum = $("#delChalNum").val();
        let issueDate = $("#issueDate").val();

        // Form Submission
        $("#form_newEntry").submit(function (config) {
            $(this), console.log("Submit to Firebase");

            //adding data instead of replacing with the new value

            // let newElement_newEntry = dbRefElement.push().setValue(itemCode);

            // Saving the user input into JSON format

            let update_data_newEntry =
            {
                'itemCode': itemCode,
                'itemName': itemName,
                'uom': uom,
                'quantity': quantity,
                'unitRate': unitRate,
                'totalAmount': totalAmount,
                'mainContract': mainContract,
                'mainVendor': mainVendor,
                'novatedContract': novatedContract,
                'novatedVendor': novatedVendor,
                'PRnum': PRnum,
                'POnum': POnum,
                'delChalNum': delChalNum,
                'issueDate': issueDate
            };

            //updating the database of New Enty in Firebase Console

            dbRefElement.push(update_data_newEntry);

            // newElement_newEntry.push(update_data_newEntry);

        });
    });

    //Creating a database Object in order to insert data into the Inventory table

    //working with the database of Inventory tab

    const dbObject_inventory = $('#table-1');

    // Sync Object Changes

    // if value changes of the '01' object

    // dbRefElement.on('value', snap => {
    //     // dbObject.html(JSON.stringify(snap.val(), null, 3));
    //     // console.log(snap.val());
    // });

    // Snyc database changes

    dbRefElement.on('value', snap => {

        //referencing all the child elements into variables

        let itemCode = snap.child("itemCode").val();
        let itemName = snap.child("itemName").val();
        let uom = snap.child("uom").val();
        let quantity = snap.child("quantity").val();

        // appending elements into the databaseTable

        $('#inventory_tableBody').append(
            "<tr><td>" + itemCode + "</td><td>" +
            itemName + "</td><td>"
            + uom + "</td><td>"
            + quantity + "</td><td>"
            + 'nil so far' + "</td></tr>");

        // $('#inventory_tableBody').html(JSON.stringify(snap.val(), null, 3));

        console.log(snap.val());
    });
});
