
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

// let items_with_zero_quantity = parseInt($('#zero_quantity_data').attr("data-end")); //first tile number
// let items_with_lessThan5_quantity = parseInt($('#lessThan5_quantity_data').attr("data-end")); //second tile number

let items_with_zero_quantity = 0;
let items_with_lessThan5_quantity = 0;
let total_quantity=0;

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
        window.location.href = "./login.html";
    }
});

function initialLoad() {

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/InventoryDatabase').once('value').then(function (snapshot) {

        console.log("Got data from the inventory!");

        let fetchedData_inventory = snapshot.val();
        console.log(fetchedData_inventory);

        //---FIRST & SECOND TILE---
        //ITEMS HAVING ZERO AND LTE5 QUANTITY

        //This code here is to check how many items have zero quantity in inventory database and pushing the number into the first tile
        for (let uniqueKey in fetchedData_inventory) {

            //Initialize the quantity only so that we can only check the ones who have zero quantity
            let quantity = fetchedData_inventory[uniqueKey]['quantity'];

            //this is for the THIRD tile
            //to keep track of total number of quantity
            total_quantity = parseInt(total_quantity) + parseInt(quantity);

            if (quantity == 0) {
                console.log("Found an item with zero quantity!");

                //item increment
                items_with_zero_quantity += 1;

                let tableToAppendData = $("#zero_quantity_table_tableBody"); //getting the table in which we will append the data
                
                 //calling function to append to table   
                appendItemsIntoTable(uniqueKey, quantity, tableToAppendData);  
            }

            else if(quantity <= 5){

                console.log("Found an item with less than 5 quantities!");

                //item increment
                items_with_lessThan5_quantity +=1;

                let tableToAppendData = $("#lessThan5_quantity_table_tableBody");

                //calling function to append to table   
                appendItemsIntoTable(uniqueKey, quantity, tableToAppendData);

            }
        }

        console.log("total_quantity: "+total_quantity);

        function appendItemsIntoTable(uniqueKey, quantity, tableToAppendData) {

            console.log("Got into the function to append items into the table");
            //loop through and parse the data then create TR in the table with this data
            let itemCode = fetchedData_inventory[uniqueKey]['itemCode'];
            let itemName = fetchedData_inventory[uniqueKey]['itemName'];
            let uom = fetchedData_inventory[uniqueKey]['uom'];

            //append in the table that's not being displayed
            // appending elements into the databaseTable
            $(tableToAppendData).append(/*html*/`
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
                </tr>
                `);
        }

        //---FIRST TILE---
        $('#zero_quantity_data').attr('data-end',items_with_zero_quantity); //NOT WORKING
        //adding database value to the tile
        $("#zero_quantity_data").text(items_with_zero_quantity);
        //on clicking the tile, the dables below will become invisible, and the data table will become visible
        $('#zero_quantity_tile').click(function () {

            $('.tile_table').css("display","none");

            //making all tables invisible
            $('.index_mainContent_below_tiles').animate({
                top: '30%'
            }, 200);

            //making the table visible
            $('#zero_quantity_table').toggle();
        });

        //---SECOND TILE---
        //ITEMS HAVING LESS THAN OR EQUAL TO 5 QUANTITY
        $('#lessThan5_quantity_data').attr('data-end',items_with_lessThan5_quantity); //NOT WORKING
        //adding database value to the tile
        $("#lessThan5_quantity_data").text(items_with_lessThan5_quantity);
        //onclicking the tile, the dables below will become invisible, and the data table will become visible
        $('#lessThan5_quantity_tile').click(function () {

            $('.tile_table').css("display","none");

            //making all tables invisible
            $('.index_mainContent_below_tiles').animate({
                top: '30%'
            }, 200);

            //making the table visible
            $('#lessThan5_quantity_table').toggle();
        });

        ////---THIRD TILE---
        

        //after clicking the first tile, it will show a table listing the names of all the items havinfg 0 quantity

    });

}


