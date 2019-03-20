//this file is to work with the Login.html PAGE portion of authentication


console.log("Initiallizing Firebase...");

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

let user_email;
let today;
let totalAmount;
let itemfound=false;
console.log('itemfound: '+itemfound);

// RealTime listener
//this checks to see if user is logged in 
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //User is logged in, redirect to profile page
        console.log("Already Signed in...");
        user_email = user.email;
        console.log("user_email: "+user_email);
        console.log("user: "+user.uid);
    }
    else {
        //user is not logged in, do nothing
        console.log('Not logged in...');
        window.location.href= "../login.html";
    }
});

//submit form

const dbRefObject = firebase.database().ref().child('databases'); //children of database object
const dbRefElement = dbRefObject.child('new_Entry'); //children of database object
const dbRefInventory =  dbRefObject.child('Inventorydatabase'); //children of database object
const dbRefDelivery =  dbRefObject.child('delivery_log'); //children of database object

//submit form

$(document).ready(function () {

    get_currentDate();

    //get the date of current day

    function get_currentDate(){
        today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        seconds = today.getTime();
    
        if(dd<10) {
            dd = '0'+dd
        } 
    
        if(mm<10) {
            mm = '0'+mm
        } 
    
        today = yyyy + '-' + mm + '-' + dd;
    }
    
    console.log("today: "+today);
    console.log("seconds: "+seconds);

    //This code here is for the event when filter icon is clicked.

    //after the filter icon being clicked, a function will be triggered where the system will look for the item code in the database return the item name and unit of measurement and fill in the respected fields
    
    $("#filter_itemCode").click(function(){
        console.log("Filter item code button has been clicked!");

        let searched_itemcode = $("#itemCode").val();

        //searching for item in database

        let response = database.ref('databases/InventoryDatabase').once('value');
            
        response.then(function(snapshot){

            let fetchedData = snapshot.val();

            //loop through and parse the data to check if the item code is present in the database
            for (let uniqueKey in fetchedData){

                let itemCode_filtered = fetchedData[uniqueKey]['itemCode'];
                let itemName_filtered = fetchedData[uniqueKey]['itemName'];
                let uom_filtered = fetchedData[uniqueKey]['uom'];
                let quantity_filtered = fetchedData[uniqueKey]['quantity'];
                     
                if (itemCode_filtered == searched_itemcode){
                    console.log('Found the item code you were looking for: '+ itemCode_filtered+', '+itemName_filtered+', '+uom_filtered);
                    
                    //item code matched, now append the other information in the input text fields

                    $('#itemName').val(itemName_filtered);
                    $('#uom').val(uom_filtered);
                    $('#quantity').val(quantity_filtered);

                }
            }
        });
    });
    

    //on clicking the submit delivery item button
    // Form Submission

    $("#form_delivery").submit(function (config) {

        let itemCode = $("#itemCode").val();
        let itemName = $("#itemName").val();
        let uom = $("#uom").val();
        let quantity = $("#quantity").val();
        let destination = $('#destination').val();
        let issueDate = $("#issueDate").val();
        
            $(this), console.log("Submit to Firebase");

            //adding data instead of replacing with the new value

            // let newElement_newEntry = dbRefElement.push().setValue(itemCode);

            // Saving the user input into JSON format
            //FOR INVENTORY DATABASE
            // let update_data_inventory = {
            //     'itemCode': itemCode,
            //     'itemName': itemName,
            //     'uom': uom,
            //     'quantity': quantity
            // };
 
            //FOR DELIVERY LOG
            let update_data_delivery_log =
            {
                'itemCode': itemCode,
                'itemName': itemName,
                'uom': uom,
                'quantity': quantity,
                'destination': destination,
                // 'unitRate': unitRate,
                // 'totalAmount': totalAmount,
                // 'mainContract': mainContract,
                // 'mainVendor': mainVendor,
                // 'novatedContract': novatedContract,
                // 'novatedVendor': novatedVendor,
                // 'PRnum': PRnum,
                // 'POnum': POnum,
                // 'delChalNum': delChalNum,
                'issueDate': issueDate,
                'user_email': user_email,
                'current_date': today
            };

            // //check to see if the data is present in the inventory
            //READING FROM FIREBASE DATABASE

            //SECTION1

            let update_newEntry_log = database.ref('databases/delivery_log').push(update_data_delivery_log);

            let response = database.ref('databases/InventoryDatabase').once('value');
            
            response.then(function(snapshot){

                console.log('itemfound: '+itemfound);

                let fetchedData = snapshot.val();

                //loop through and parse the data then create TR in the table with this data
                for (let uniqueKey in fetchedData){

                    let itemCode_fetched = fetchedData[uniqueKey]['itemCode'];
                    let existingQuantity = fetchedData[uniqueKey]['quantity'];
                     
                    if (itemCode_fetched == itemCode){

                        //THIS MEANS ITEM EXISTS IN DATABASE SO JUST INCREMENT IT BY QUANTITY
                        let newQuantity = parseInt(existingQuantity) - parseInt(quantity);

                        let data = {
                            'quantity': newQuantity
                        }

                        itemfound=true;

                        let updating_inventory = database.ref('databases/InventoryDatabase/' + uniqueKey).update(data).then(function(){
                            alert('Item Delivered Successfully!');
                            console.log('itemfound: '+itemfound);
                            location.reload();
                            return false;
                            
                        });
                    }
                }

                if (itemfound==false){
                    // else{

                    // THIS MEANS ITEM DOES NOT EXIST IN DATASBE SO IT CANNOT BE SENT AWAY

                    //NEED TO ALERT THAT THE ITEM IS NOT PRESENT IN THE INVENTORY

                    // let pushing_inventory = database.ref('databases/InventoryDatabase/').push(update_data_inventory).then(function(){
                    alert('Item not found in the inventory! Please check if you have entered the item code correctly');
                    // location.reload();
                    return false;
                    // });              
                }
            });
            itemfound=false;
        });
    });
