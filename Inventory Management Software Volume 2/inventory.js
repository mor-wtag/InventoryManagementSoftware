//this file will work with inventory.html


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

let uniqueKey_Array=[];

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
        window.location.href= "./login.html";
    }
});

function initialLoad(){

    //searching realtime database
    //checking to see if the item code is present in the database already

    // var searchForItemCode = database.ref('databases/new_Entry').once('value').

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/InventoryDatabase').once('value').then(function(snapshot){

        let fetchedData = snapshot.val();
        console.log(fetchedData);

        //Code in order to show the last entry first (LAST IN FIRST OUT)

        //loop through unique keys and create an array in order to view get all the unique keys
        let uniqueKeyArray_index=0;
        for (let uniqueKey in fetchedData){
            uniqueKey_Array[uniqueKeyArray_index] =  uniqueKey;
            uniqueKeyArray_index++;
        }

        console.log('uniqueKey_Array: '+uniqueKey_Array);

        //from the unique key array, reverse it and set each variable so that the fetched data from that unique key can be found

        for (let reversed_uniqueKey_index=uniqueKey_Array.length-1; reversed_uniqueKey_index>=0; reversed_uniqueKey_index--){
            let reversed_uniqueKey = uniqueKey_Array[reversed_uniqueKey_index];
        

        //loop through and parse the data then create TR in the table with this data
        // for (let uniqueKey in fetchedData){
            let itemCode = fetchedData[reversed_uniqueKey]['itemCode'];
            let itemName = fetchedData[reversed_uniqueKey]['itemName'];
            let uom = fetchedData[reversed_uniqueKey]['uom'];
            let quantity = fetchedData[reversed_uniqueKey]['quantity'];

            // appending elements into the databaseTable
            $('#inventory_tableBody').append(/*html*/`
                <tr data-key="${reversed_uniqueKey}">
                    <td>
                        ${itemCode}
                    </td>
                    <td>
                        ${itemName}
                    </td>
                    <td>
                        ${uom}
                    </td>
                    <td>
                        ${quantity}
                    </td>
                    <td>
                        nil so far
                    </td
                </tr>
            `);

        }
    });
}
