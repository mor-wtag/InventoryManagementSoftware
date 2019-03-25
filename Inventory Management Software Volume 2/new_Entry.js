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
let seconds;
let totalAmount;
let itemfound=false;
let item_uploaded=false;
let getting_selected_item_boolean=false;

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
    
    //looping through and ensuring all the filter buttons work the same way

    for (let itemAdded_index=0; itemAdded_index<5; itemAdded_index++){

        let first_item_matched=false;

        //searching for item in database

        let response = database.ref('databases/InventoryDatabase').once('value');
                
        response.then(function(snapshot){

            let fetchedData = snapshot.val();

            //FILTER BUTTON FOR THE ITEM CODE

            $("#filter_itemCode"+itemAdded_index).click(function(){
                console.log("Filter item code button has been clicked!");

                //loop through and parse the data to check if the item code is present in the database
                for (let uniqueKey in fetchedData){

                    let itemCode_filtered = fetchedData[uniqueKey]['itemCode'];
                    let itemName_filtered = fetchedData[uniqueKey]['itemName'];
                    let uom_filtered = fetchedData[uniqueKey]['uom'];
                    let quantity_filtered = fetchedData[uniqueKey]['quantity'];
                            
                    if (itemCode_filtered == searched_itemcode){
                        console.log('Found the item code you were looking for: '+ itemCode_filtered+', '+itemName_filtered+', '+uom_filtered);
                            
                        //item code matched, now append the other information in the input text fields

                        $('#itemName'+itemAdded_index).val(itemName_filtered);
                        $('#uom'+itemAdded_index).val(uom_filtered);
                        $('#quantity'+itemAdded_index).val(quantity_filtered);

                    }
                }
            });
            
            //FILTER BUTTON FOR ITEM NAME

            //this code here is to filter item names and populate a dropdown table consisting of all the item names in the inventory the entered data is similar to
            //onclicking the filter button beside the item name

            $("#filter_itemName"+itemAdded_index).click(function(){

                //get item name from the input field
                let searched_itemName = $("#itemName"+itemAdded_index).val();

                //loop through and parse the data to check if the item name is present in the database
                for (let uniqueKey in fetchedData){

                    getting_selected_item_boolean=true;

                    let itemCode_filtered = fetchedData[uniqueKey]['itemCode'];
                    let itemName_filtered = fetchedData[uniqueKey]['itemName'];
                    let uom_filtered = fetchedData[uniqueKey]['uom'];
                    let quantity_filtered = fetchedData[uniqueKey]['quantity'];

                    //converting both to string format 

                    let string_itemName_filtered = itemName_filtered.toString();
                    let string_searched_itemName = searched_itemName.toString();

                    //look for partial/complete match of the item Name searched string and the item name found in database string

                    if (string_itemName_filtered.includes(string_searched_itemName)){

                        console.log('Found the item code you were looking for: '+ string_itemName_filtered);

                        //checking to see whether we have found the first item that matched or its the subsequent items

                        if (first_item_matched==false){

                            //append html code to insert dynamic dropdown select function
                            $("#itemName"+itemAdded_index).append(`<datalist id='itemName_dropdown'></datalist>`);
                            first_item_matched=true;

                            console.log("First item appended! Dropdown injected");
                        }

                        //checked if its the first item, now add the option values

                        $("#itemName_dropdown").append(`<option id='${string_itemName_filtered}'>${string_itemName_filtered}</option>`);

                        console.log('Items appended: '+string_itemName_filtered);
                    }
                }

                if (getting_selected_item_boolean==true){

                item_filter_button_clicked();
                }

                //this is the code to get the selected item from the dropdown list and then get the itemcode, quantity, uom from the database
                // var selected_itemName = $('#itemName_dropdown :selected').text();
            });

            function item_filter_button_clicked(){
                let item_filter_button_clicked = $( "#itemName_dropdown" ).val();
                console.log("item_filter_button_clicked: "+item_filter_button_clicked);
            }

            // if (item_filter_button_clicked=true)

            //     $( "#itemName_dropdown" )
            //     .change(function() {
            //         var str = "";
            //         $( "#itemName_dropdown option:selected" ).each(function() {
            //         str += $( this ).text() + " ";
            //         });
            //         // $( "div" ).text( str );
            //         console.log("The item selected is: "+str);
            //     })
            //     .trigger( "change" );
            // });


        });
    }

    //on clicking the submit new Entry button
    //Looping through to see which button has been clicked and how many entries have to be submitted
    
    for (let add_item_index=0; add_item_index<5; add_item_index++){

        $("#form_newEntry"+add_item_index).submit(function (config) {

            let submitButtonClicked = "#form_newEntry"+add_item_index;

            console.log('The submit button that has een clicked has the id: '+submitButtonClicked);

            //after knowing which submit button has been clicked, loop through and convert each form entry into a JSON to be pushed into the database later 

            for (let form_fields_index=0; form_fields_index<=add_item_index; form_fields_index++){

                let itemCode = $("#itemCode"+form_fields_index).val();
                let itemName = $("#itemName"+form_fields_index).val();
                let uom = $("#uom"+form_fields_index).val();
                let quantity = $("#quantity"+form_fields_index).val();
                let unitRate = $("#unitRate"+form_fields_index).val();
                let mainContract = $("#mainContract"+form_fields_index).val();
                let mainVendor = $("#mainVendor"+form_fields_index).val();
                let novatedContract = $("#novatedContract"+form_fields_index).val();
                let novatedVendor = $("#novatedVendor"+form_fields_index).val();
                let PRnum = $("#PRnum"+form_fields_index).val();
                let POnum = $("#POnum"+form_fields_index).val();
                let delChalNum = $("#delChalNum"+form_fields_index).val();
                let issueDate = $("#issueDate"+form_fields_index).val();

                //calculate the total amount
                totalAmount = (unitRate*quantity);

                // Form Submission
                
                $(this), console.log("Submit to Firebase");

                //adding data instead of replacing with the new value
                // Saving the user input into JSON format

                //FOR INVENTORY DATABASE
                let update_data_inventory = {
                    'itemCode': itemCode,
                    'itemName': itemName,
                    'uom': uom,
                    'quantity': quantity
                };
        
                //FOR NEW ENTRY LOG
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
                    'issueDate': issueDate,
                    'user_email': user_email,
                    'current_date': today,
                };

            
            console.log(update_data_inventory);
            console.log(update_data_newEntry);

            // //check to see if the data is present in the inventory
            //READING FROM FIREBASE DATABASE

            //SECTION1

            let update_newEntry_log = database.ref('databases/entry_log').push(update_data_newEntry);

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
                        let newQuantity = parseInt(quantity) + parseInt(existingQuantity);

                        let data = {
                            'quantity': newQuantity
                        }

                        itemfound=true;

                        let updating_inventory = database.ref('databases/InventoryDatabase/' + uniqueKey).update(data).then(function(){
                        });
                    }
                }

                if (itemfound==false){

                    // THIS MEANS ITEM DOES NOT EXIST IN DATASBE SO JUST SET IT TO A NEW ITEM WITH QUANTITY
                    // pushing the inventory data

                    let pushing_inventory = database.ref('databases/InventoryDatabase/').push(update_data_inventory).then(function(){
                    });              
                }
            });

            if (form_fields_index==add_item_index){
                alert('Data uploaded Successfully!');
                location.reload();
                return false;
            }
            itemfound=false;
        // });
            }
        });


        //CODE FOR ADDING A NEW ITEM 

        //when the add new item button is clicked, this function will append the same form below the existing form, filling up some of the common input fields with the information existing in the current item entry form

        $('#add_newItem'+add_item_index).click(function(){

            $('#form_newEntry'+add_item_index).css('display','block');
            $('#submit_newEntry'+add_item_index).css('display','none');
            $('#add_newItem'+add_item_index).css('display','none');

            //this code here is to fill up all the common spaces if a new item is to be added
            //system will take the previously entered data and complete the data fields

            let previous_index= add_item_index-1;

            console.log("current index:"+ add_item_index);
            console.log("previous index:"+ previous_index);

            //getting the values of the fields from the previous index

            let mainContract_prev = $("#mainContract"+previous_index).val();
            let mainVendor_prev = $("#mainVendor"+previous_index).val();
            let novatedContract_prev = $("#novatedContract"+previous_index).val();
            let novatedVendor_prev = $("#novatedVendor"+previous_index).val();
            let PRnum_prev = $("#PRnum"+previous_index).val();
            let POnum_prev = $("#POnum"+previous_index).val();
            let delChalNum_prev = $("#delChalNum"+previous_index).val();
            let issueDate_prev = $("#issueDate"+previous_index).val();

            //after getting the values of the previous fields, set the pre fetched values into the new item to be added fields

            $("#mainContract"+add_item_index).val(mainContract_prev);
            $("#mainVendor"+add_item_index).val(mainVendor_prev);
            $("#novatedContract"+add_item_index).val(novatedContract_prev);
            $("#novatedVendor"+add_item_index).val(novatedVendor_prev);
            $("#PRnum"+add_item_index).val(PRnum_prev);
            $("#POnum"+add_item_index).val(POnum_prev);
            $("#delChalNum"+add_item_index).val(delChalNum_prev);
            $("#issueDate"+add_item_index).val(issueDate_prev);

            //this code here is to hide a form when the close button is clicked

            $("#hide_form"+add_item_index).click(function(){
                $('#form_newEntry'+add_item_index).css('display','none');
                $('#submit_newEntry'+add_item_index).css('display','inline-block');
                $('#add_newItem'+add_item_index).css('display','inline-block');
            })


        });
    }

    //SECTION1
    //GET THE DATA FROM THE EXCEL FILE LIKE THE JS FIDDLE EXAMPLE

    let oFileIn;

    $(function() {
        oFileIn = document.getElementById('fileButton_BOQ');
        if(oFileIn.addEventListener) {
            oFileIn.addEventListener('change', filePicked, false);
        }
        console.log('file has been submitted');
    });


    function filePicked(oEvent) {

        // Get The File From The Input
        var oFile = oEvent.target.files[0];
        var sFilename = oFile.name;
        let heading = ['itemCode','itemName','uom' ,'quantity','unitRate','totalAmount','mainContract','mainVendor','novatedContract','novatedVendor','PRnum','POnum','delChalNum','issueDate'];
        
        // Create A File Reader HTML5
        var reader = new FileReader();
        
        // Ready The Event For When A File Gets Selected
       let readingExcelFile =  reader.onload = function(e) {
            var data = e.target.result;
            var cfb = XLS.CFB.read(data, {type: 'binary'});
            var wb = XLS.parse_xlscfb(cfb);
            // Loop Over Each Sheet
            wb.SheetNames.forEach(function(sheetName) {
                console.log(sheetName);
  
                var data = XLS.utils.sheet_to_json(wb.Sheets[sheetName], {header:1}); 
                
                $.each(data, function( indexR, valueR ) {
                    let dataToCommit = {};
                    $.each(data[indexR], function( indexC, valueC ) {

                        if (parseInt(indexR)!=0){

                            console.log(`For Row: ${indexR} AND For Column: ${indexC} | CELL VALUE: ${valueC}`);
                            console.log('======================================');
            
                            let keyName = heading[parseInt(indexC)];
    
                            if (valueC == undefined){
                                valueC = 'N/A';
                            }
    
                            dataToCommit[keyName] = valueC;
                        }
                    });

                    console.log(dataToCommit);

                    // check to see if the item code is present in the json format formed from the excel data format

                    let itemCodeToCommit = dataToCommit['itemCode'];
                    let quantityToCommit = dataToCommit['quantity'];
                    let nameToCommit = dataToCommit['itemName'];
                    let uomToCommit = dataToCommit['uom'];

                    let update_data_inventory = {
                        'itemCode': itemCodeToCommit,
                        'itemName': nameToCommit,
                        'uom': uomToCommit,
                        'quantity': quantityToCommit
                    }

                    console.log("update_data_inventory: "+update_data_inventory);

                    let response = database.ref('databases/InventoryDatabase').once('value');

                    response.then(function (snapshot) {

                        let fetchedData = snapshot.val();

                        //loop through and parse the data then create TR in the table with this data
                        for (let uniqueKey in fetchedData) {

                            let itemCode_fetched = fetchedData[uniqueKey]['itemCode'];
                            let existingQuantity = fetchedData[uniqueKey]['quantity'];

                            if (itemCode_fetched == itemCodeToCommit) {

                                console.log("---Item matched!---");
                                console.log("Item code: "+itemCode_fetched);

                                //THIS MEANS ITEM EXISTS IN DATABASE SO JUST INCREMENT IT BY QUANTITY
                                let newQuantity = parseInt(quantityToCommit) + parseInt(existingQuantity);

                                let data = {
                                    'quantity': newQuantity
                                }

                                itemfound=true;

                                database.ref('databases/InventoryDatabase/' + uniqueKey).update(data).then(function () {
                                    // alert('Data uploaded Successfully!');
                                    // window.location.href = "./newEntry.html";
                                    // return false;
                                    console.log("...Data updated....");
                                });
                            }
                        }

                        if (itemfound==false){
                            // else {

                                //THIS MEANS ITEM DOES NOT EXIST IN DATASBE SO JUST SET IT TO A NEW ITEM WITH QUANTITY

                                //pushing the inventory data

                            let pushing_inventory = database.ref('databases/InventoryDatabase/').push(update_data_inventory).then(function () {
                                // alert('Data uploaded Successfully!');
                                // window.location.href = "./newEntry.html";
                                // return false;
                                console.log("...Data not found, updating table");
                            });
                        }
                        itemfound=false;
                    });

                });

                // data.then(function(){
                alert("Successfully added items from the file");
                location.reload();
                return false;
            });
        };
        
    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);
    }

});
















