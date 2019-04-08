
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

let items_with_zero_quantity = 0 //first tile

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

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/InventoryDatabase').once('value').then(function(snapshot){

        console.log("Got data from the inventory!");

        let fetchedData_inventory = snapshot.val();
        console.log(fetchedData_inventory);

        //FIRST TILE
        //ITEMS HAVING ZERO QUANTITY

        //This code here is to check how many items have zero quantity in inventory database and pushing the number into the first tile
        for (let uniqueKey in fetchedData_inventory){

            //Initialize the quantity only so that we can only check the ones who have zero quantity
            let quantity = fetchedData_inventory[uniqueKey]['quantity'];

            if (quantity==0){

                console.log("Found an item with zero quantity!");

                //item increment
                items_with_zero_quantity+=1;

                //appending the value into the first tile
                $("#zero_quantity_data").data('end', '100');

                $("#zero_quantity_data").html('100');

                //loop through and parse the data then create TR in the table with this data
                let itemCode = fetchedData_inventory[uniqueKey]['itemCode'];
                let itemName = fetchedData_inventory[uniqueKey]['itemName'];
                let uom = fetchedData_inventory[uniqueKey]['uom'];
            }


        }
        
        //after clicking the first tile, it will show a table listing the names of all the items havinfg 0 quantity

    });

}


