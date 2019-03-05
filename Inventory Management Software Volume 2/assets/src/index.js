
//this file will work with index.html


// Initialize Firebase
let config = {
    apiKey: "AIzaSyAPITJ_b82lngDCMBkqOP4sf28fogy_QMc",
    authDomain: "inventorymanagementsoftware-gp.firebaseapp.com",
    databaseURL: "https://inventorymanagementsoftware-gp.firebaseio.com/",
    projectId: "inventorymanagementsoftware-gp",
    storageBucket: "inventorymanagementsoftware-gp.appspot.com",
    messagingSenderId: "451262431109"
};

let initialize = firebase.initializeApp(config);
let database = firebase.database();

// RealTime listener
//this checks to see if user is logged in 
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //User is logged in, fetch the database using UID and populate everything
        console.log("Already Signed in...");
        initialLoad();
    }
    else {
        //user is not logged in, send him to login page
        console.log('Not logged in...');
        window.location.href= "/login.html";
    }
});


// function initialLoad(){
//     //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

//     //READING FROM FIREBASE DATABASE
//     database.ref('databases/').once('value').then(function(snapshot){

//         let fetchedData = snapshot.val();
//         console.log(fetchedData);
//         new_Entry:{
//             Lakdjshaskdjhaskdjhasdkh:{
//                 POnum:..
//             },
//             asdlahsdalksdhasldkjsalkdj:{

//             },
//             asdljahsdjakshdkajsh:{

//             }
//         }

//         for (let uniqueKey in fetchedData){

//             let POnum_val = fetchedData[uniqueKey]['POnum'];
//             let PRnum = fetchedData[uniqueKey]['PRnum'];

//         }

//     });

//     name = ['Ekram', 'Ramisa', 'Rutviz'];
//     age = ['25', '24', '26'];

//     for (let i=0; i<name.length, i++)
//     {
//         console.log('name: '+name[i]);
//         console.log('age: '+age[i]);
//     }

//     JSON = [
//         Ekram: {
//             age: 25
//         },
//         Ramisa: {
//             age: 24
//         },
//         Rutviz: {
//             age: 26
//         }
//     ]

//     for (let name in JSON){

//         console.log(name);
//         console.log(JSON[name]['age']);

//         // console.log('name: '+ );
//         // console.log('age: '+ );

//     }


//     Ekram
//     25
//     Ramisa
//     24
//     Rutviz
//     26
    
// }


//Working with Firebase database

//Uploading BOQ and storing it in the database

//Get elements
let uploader = $('.uploader');
let fileButton = $('.fileButton');

//Listen for file selection
fileButton.change(function (e) {
    console.log("Attempting to upload a file...");
    // Get File
    let file = e.target.files[0];

    let fileName = file.name

    // Create Storage bar
    let storageRef = firebase.storage().ref('BOQ/' + fileName)

    // Upload file
    let task = storageRef.put(file);

    // Update storage bar
    task.on("state_changed",
        function progress(snapshot) {
            console.log('Inside Progress bar');
            var percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            uploader.value = percentage;
            console.log('percentage = ' + percentage);
            console.log('Uploader value = ' + uploader.value);
        },
        function error(err) {

        },
        function complete() {
            alert('File Successfully Uploaded!');
        }
    );
    //Get download URL of Excel Uploaded files

        let boq_downloadLink = firebase.storage().ref('BOQ/'+fileName);
        boq_downloadLink.getDownloadURL().then(function(url) {
            console.log("url: "+url);
    });
});

// New new Entry database file

//checking whether the required fields are filled

// function formcheck() {
//     var fields = $(".ss-item-required")
//           .find("select, textarea, input").serializeArray();

//     $.each(fields, function(i, field) {
//       if (!field.value)
//         alert(field.name + ' is required');
//      }); 
//     console.log(fields);
//   }

//submit form

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
