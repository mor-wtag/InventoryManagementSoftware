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

let uniqueKey_Array = [];
let quantity_Array = [];

let inventoryTablePopulated = false;

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

    //searching realtime database
    //checking to see if the item code is present in the database already

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/InventoryDatabase').once('value').then(function (snapshot) {

        let fetchedData = snapshot.val();
        console.log(fetchedData);

        //Code in order to show the last entry first (LAST IN FIRST OUT)

        //loop through unique keys and create an array in order to view get all the unique keys and their corresponding quantities
        let uniqueKeyArray_index = 0;
        for (let uniqueKey in fetchedData) {

            uniqueKey_Array[uniqueKeyArray_index] = uniqueKey;

            quantity_Array[uniqueKeyArray_index] = fetchedData[uniqueKey]['quantity']; //saving the quantities in a different array

            uniqueKeyArray_index++;
        }

        //SORTING THE ARRAYS USING JS BUILT IN FUNCTION

        // Sort the numbers in the Quantity array in ascending order

        //SORTING ARRAYS
        //finding out the destinations with the most quantities
        //sorting the quantities keeping the destination recorded

        //1) combine the arrays:
        let list_decending_sorted = [];
        for (var j = 0; j < uniqueKey_Array.length; j++)
            list_decending_sorted.push({'quantity': quantity_Array[j], 'uniqueKey': uniqueKey_Array[j]});

        //2) sort:
        list_decending_sorted.sort(function (a, b) {
            return ((a.quantity > b.quantity) ? -1 : ((a.quantity == b.quantity) ? 0 : 1));
        });

        console.log('uniqueKey_Array: ' + uniqueKey_Array);
        console.log('quantity_Array: ' + quantity_Array);
        console.log(list_decending_sorted);
        console.log(list_decending_sorted[0].quantity);
        // console.log('ascending_sorted_array: ' + ascending_sorted_array);

        //FUNCTION TO APPEND ITEMS INTO THE TABLE
        function appendItemsIntoTable(uniqueKey, database_table, tableToAppendData) {

            console.log("Got into the function to append items into the table");
            //loop through and parse the data then create TR in the table with this data
            let itemCode = database_table[uniqueKey]['itemCode'];
            let itemName = database_table[uniqueKey]['itemName'];
            let uom = database_table[uniqueKey]['uom'];
            let quantity = database_table[uniqueKey]['quantity'];

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

        //from the unique key array, reverse it and set each variable so that the fetched data from that unique key can be found
        for (let reversed_uniqueKey_index = uniqueKey_Array.length - 1; reversed_uniqueKey_index >= 0; reversed_uniqueKey_index--) {

            let reversed_uniqueKey = uniqueKey_Array[reversed_uniqueKey_index];

            //Calling the function to append the items into the table in the reversed order, providing uniquekey, database table and table body
            appendItemsIntoTable(reversed_uniqueKey, fetchedData, inventory_tableBody);
        }


        //EXPORT TO EXCEL

        $("#exportToExcel").click(function () {
            $("#exportToExcel").css('color', 'white');

            //creating a workbook from the table
            var wb = XLSX.utils.table_to_book(document.getElementById('inventory_table'), { sheet: "Sheet JS" });
            //writing the binary type data
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
            //function to parse the table
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i < s.length; i++)
                    view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            //saving file downloading
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'inventoryTable.xlsx');
        });

        // ---- EVENT LISTENER FOR SORTING---- 
        // this code here is for sorting the quantity of items both in ascending and decending order by clicking on the icons beside the quantity

        // code for matching and appending the ASCENDING SORTED QUANTITY elements into the table 

        $("#quantity_sort_des").click(function () {

            $('#inventory_tableBody').empty();  //emptying the table so that sorted values can be appended

            //loop through the Ascending Order Array in order to match it with elements in the database

            for (let asc_sorted_index = 0; asc_sorted_index < uniqueKey_Array.length; asc_sorted_index++) {

                let key_to_be_passed = list_decending_sorted[asc_sorted_index].uniqueKey;

                appendItemsIntoTable(key_to_be_passed, fetchedData, inventory_tableBody);
            }
        });

        //code for matching and appending the DECENDING SORTED QUANTITY elements into the table 

        $("#quantity_sort_asc").click(function () {

            console.log("Got inside the decending order sorting function");

            $('#inventory_tableBody').empty();  //emptying the table so that sorted values can be appended

            //loop through the Ascending Order Array in order to match it with elements in the database

            for (let dec_sorted_index = uniqueKey_Array.length-1; dec_sorted_index>=0; dec_sorted_index--) {

                let key_to_be_passed = list_decending_sorted[dec_sorted_index].uniqueKey;

                appendItemsIntoTable(key_to_be_passed, fetchedData, inventory_tableBody);
            }

        });

        //----EVENT LISTENER FOR SEARCH FIELD IN INVENTORY----

        //this code here is for dynamically searching (on key press) for the item in the inventory
        //as the user will be searching, the table will keep populating and appending similar items like the dropdown created previously 

        $("#search_inventory").on("keydown" && "keyup", function () {

            //on erasing the search field, the table needs to repopulate again with all the inventory items

            console.log("Got inside the search function");

            $('#inventory_tableBody').empty();  //emptying the table so that sorted values can be appended

            //get item name from the input field
            let search_inventory = $("#search_inventory").val();

            //from the unique key array, reverse it and set each variable so that the fetched data from that unique key can be found

            for (let reversed_uniqueKey_index = uniqueKey_Array.length - 1; reversed_uniqueKey_index >= 0; reversed_uniqueKey_index--) {

                let reversed_uniqueKey = uniqueKey_Array[reversed_uniqueKey_index];

                let itemName = fetchedData[reversed_uniqueKey]['itemName'];

                let string_itemName_filtered = itemName.toString();
                let string_searched_itemName = search_inventory.toString().toLowerCase();
                let string_itemName_filtered_lowercase = string_itemName_filtered.toLowerCase();// lowercase version of the filtered string item so that it can be compared

                //look for partial/complete match of the item Name searched string and the item name found in database string

                if (string_itemName_filtered_lowercase.includes(string_searched_itemName)) {

                    console.log('Found the item code you were looking for: ' + string_itemName_filtered); //adding the item that's not converted to lowercase so that it can be used to get the correct information from the database
                    
                    // appending elements into the databaseTable
                    appendItemsIntoTable(reversed_uniqueKey, fetchedData, inventory_tableBody);
                }
            }

        });
    });

    //---LOGOUT---
    $("#logoutBtn").click(function () {

        //ask if sure they want to sign out

        let signOut = confirm("Are you sure you want to sign out?");

        if (signOut == true) {

            //user clicked ok

            firebase.auth().signOut().then(function () {
                // Sign-out successful.
                //send back to the login page
                window.location.href = "./login.html";

            }).catch(function (error) {
                // An error happened.
                alert("error.code");
            });
        }
        else {
            //user clicked cancel
            //stay in the same page
            return false;
        }

    });
}
