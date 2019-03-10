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

const dbRefObject = firebase.database().ref().child('databases'); //children of database object
const dbRefInventory = dbRefObject.child('inventory'); //children of database object

let update_data_inventory;

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

    var searchForItemCode = database.ref('databases/new_Entry').once('value').then(function(snapshot){

        let fetchedFromNewEntry = snapshot.val();

        //loop through and parse the data then create TR in the table with this data
        for (let uniqueKey in fetchedFromNewEntry){

            let itemCode = fetchedFromNewEntry[uniqueKey]['itemCode'];
            let itemName = fetchedFromNewEntry[uniqueKey]['itemName'];
            let uom = fetchedFromNewEntry[uniqueKey]['uom'];
            let quantity = fetchedFromNewEntry[uniqueKey]['quantity'];

            console.log('itemCode: '+itemCode);

            //search through the database for item code
            dbRefInventory.orderByChild("itemCode").equalTo(itemCode).once("value",snapshot => {

                let itemCodeExists = fetchedFromNewEntry[uniqueKey]['itemCode'];

                console.log("snapshot: "+snapshot.val());
                console.log("snapshot key: "+snapshot.key);

                //checking if the item code exists
                if (snapshot.exists()){
                    console.log('itemCode: '+itemCode);
                    console.log('value exists in the inventory database! Proceeding to increase quantity');
                    let keyOfFoundElement = snapshot.key; //finding key of child element
                    console.log('keyOfFoundElement: '+keyOfFoundElement);
                    console.log('itemCodeExists: '+itemCodeExists);

                    //looking at the inventory database

                }
                
                else{

                    update_data_inventory =
                        {
                            'itemCode': itemCode,
                            'itemName': itemName,
                            'uom': uom,
                            'quantity': quantity
                        };
                }
            // }

            //updating the database of New Enty in Firebase Console

            dbRefInventory.push(update_data_inventory);

            // newElement_newEntry.push(update_data_newEntry);
        });

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/inventory').once('value').then(function(snapshot){

        let fetchedData = snapshot.val();
        console.log(fetchedData);

        //loop through and parse the data then create TR in the table with this data
        for (let uniqueKey in fetchedData){
            let itemCode = fetchedData[uniqueKey]['itemCode'];
            let itemName = fetchedData[uniqueKey]['itemName'];
            let uom = fetchedData[uniqueKey]['uom'];
            let quantity = fetchedData[uniqueKey]['quantity'];

            // appending elements into the databaseTable
            $('#inventory_tableBody').append(/*html*/`
                <tr data-key="${uniqueKey}">
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
    });
}
