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
let quantity_Array=[];

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

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/InventoryDatabase').once('value').then(function(snapshot){

        let fetchedData = snapshot.val();
        console.log(fetchedData);

        //Code in order to show the last entry first (LAST IN FIRST OUT)

        //loop through unique keys and create an array in order to view get all the unique keys and their corresponding quantities
        let uniqueKeyArray_index=0;
        for (let uniqueKey in fetchedData){

            uniqueKey_Array[uniqueKeyArray_index] =  uniqueKey;

            quantity_Array[uniqueKeyArray_index] = fetchedData[uniqueKey]['quantity']; //saving the quantities in a different array

            uniqueKeyArray_index++;
        }

        //SORTING THE ARRAYS USING JS BUILT IN FUNCTION

        // Sort the numbers in the Quantity array in ascending order
        let decending_sorted_array = quantity_Array.slice();  
        decending_sorted_array.sort((a, b) => b - a)     

        // Reversing the array to get the descending order quantities
        let ascending_sorted_array = decending_sorted_array.slice(); 
        ascending_sorted_array.reverse();               

        console.log('uniqueKey_Array: '+uniqueKey_Array);
        console.log('quantity_Array: '+quantity_Array);
        console.log('decending_sorted_array: '+decending_sorted_array);
        console.log('ascending_sorted_array: '+ascending_sorted_array);

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

        //---- EVENT LISTENER FOR SORTING---- 
        //this code here is for sorting the quantity of items both in ascending and decending order by clicking on the icons beside the quantity

        //code for matching and appending the ASCENDING SORTED QUANTITY elements into the table 

        $("#quantity_sort_asc").click(function(){

            $('#inventory_tableBody').empty();  //emptying the table so that sorted values can be appended

            console.log('ascending_sorted_array: '+ascending_sorted_array);

            //loop through the Ascending Order Array in order to match it with elements in the database

            for (let asc_sorted_index=0; asc_sorted_index < ascending_sorted_array.length; asc_sorted_index++){

                //loop through and parse the data then create TR in the table with this data
                for (let uniqueKey in fetchedData){
                    let itemCode = fetchedData[uniqueKey]['itemCode'];
                    let itemName = fetchedData[uniqueKey]['itemName'];
                    let uom = fetchedData[uniqueKey]['uom'];
                    let quantity = fetchedData[uniqueKey]['quantity'];

                    if(quantity == ascending_sorted_array[asc_sorted_index]){

                        console.log(`Appending item: itemCode=${itemCode}, itemName= ${itemName}, uom= ${uom}, quantity=${quantity}`);
                        console.log(`Quantity: ${quantity}`);

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
                    break;
                    }
                }
            }
        });

        //code for matching and appending the DECENDING SORTED QUANTITY elements into the table 

        $("#quantity_sort_des").click(function(){

            console.log("Fot inside the decending order sorting function");

            $('#inventory_tableBody').empty();  //emptying the table so that sorted values can be appended

            console.log('decending_sorted_array: '+decending_sorted_array);

            //loop through the Ascending Order Array in order to match it with elements in the database

            for (let dec_sorted_index=0; dec_sorted_index< decending_sorted_array.length; dec_sorted_index++){

                //loop through and parse the data then create TR in the table with this data
                for (let uniqueKey in fetchedData){
                    let itemCode = fetchedData[uniqueKey]['itemCode'];
                    let itemName = fetchedData[uniqueKey]['itemName'];
                    let uom = fetchedData[uniqueKey]['uom'];
                    let quantity = fetchedData[uniqueKey]['quantity'];

                    if(quantity == decending_sorted_array[dec_sorted_index]){
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
                    break;
                    }
                }
            }

        });

        //----EVENT LISTENER FOR SEARCH FIELD IN INVENTORY----

        //this code here is for dynamically searching (on key press) for the item in the inventory
        //as the user will be searching, the table will keep populating and appending similar items like the dropdown created previously 

        $("#search_inventory").on("keydown" && "keyup", function(){

            //on erasing the search field, the table needs to repopulate again with all the inventory items

            console.log("Got inside the search function");

            $('#inventory_tableBody').empty();  //emptying the table so that sorted values can be appended

             //get item name from the input field
             let search_inventory = $("#search_inventory").val();

             //from the unique key array, reverse it and set each variable so that the fetched data from that unique key can be found

        for (let reversed_uniqueKey_index=uniqueKey_Array.length-1; reversed_uniqueKey_index>=0; reversed_uniqueKey_index--){
            
            let reversed_uniqueKey = uniqueKey_Array[reversed_uniqueKey_index];
        

            //loop through and parse the data then create TR in the table with this data
            let itemCode = fetchedData[reversed_uniqueKey]['itemCode'];
            let itemName = fetchedData[reversed_uniqueKey]['itemName'];
            let uom = fetchedData[reversed_uniqueKey]['uom'];
            let quantity = fetchedData[reversed_uniqueKey]['quantity'];

            let string_itemName_filtered = itemName.toString();

            let string_searched_itemName = search_inventory.toString().toLowerCase();

            let string_itemName_filtered_lowercase = string_itemName_filtered.toLowerCase();// lowercase version of the filtered string item so that it can be compared

            //look for partial/complete match of the item Name searched string and the item name found in database string

            if (string_itemName_filtered_lowercase.includes(string_searched_itemName)){

                 console.log('Found the item code you were looking for: '+ string_itemName_filtered); //adding the item that's not converted to lowercase so that it can be used to get the correct information from the database
                // appending elements into the databaseTable
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
        }
    });
    });
}
