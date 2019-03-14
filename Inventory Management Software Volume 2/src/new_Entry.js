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

    $("#submit_newEntry").click(function () {

        let itemCode = $("#itemCode").val();
        let itemName = $("#itemName").val();
        let uom = $("#uom").val();
        let quantity = $("#quantity").val();
        let unitRate = $("#unitRate").val();
        let mainContract = $("#mainContract").val();
        let mainVendor = $("#mainVendor").val();
        let novatedContract = $("#novatedContract").val();
        let novatedVendor = $("#novatedVendor").val();
        let PRnum = $("#PRnum").val();
        let POnum = $("#POnum").val();
        let delChalNum = $("#delChalNum").val();
        let issueDate = $("#issueDate").val();

        //calculate the total amount
        totalAmount = (unitRate*quantity);

        // Form Submission
        $("#form_newEntry").submit(function (config) {
            $(this), console.log("Submit to Firebase");

            //adding data instead of replacing with the new value

            // let newElement_newEntry = dbRefElement.push().setValue(itemCode);

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
                'seconds': seconds
            };

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

                        database.ref('databases/InventoryDatabase/' + uniqueKey).update(data).then(function(){
                            alert('Data updated Successfully!');
                            window.location.href = "./newEntry.html";
                            console.log('itemfound: '+itemfound);
                            return false;
                        });
                    }
                }

                if (itemfound==false){
                    // else{

                    // THIS MEANS ITEM DOES NOT EXIST IN DATASBE SO JUST SET IT TO A NEW ITEM WITH QUANTITY

                    // pushing the inventory data

                    let pushing_inventory = database.ref('databases/InventoryDatabase/').push(update_data_inventory).then(function(){
                        alert('Data uploaded Successfully!');
                        window.location.href = "./newEntry.html";
                        return false;
                    });                   
                }
            });
            itemfound=false;
        });
    });

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
            });
        };

    //     alert('Data uploaded Successfully!');
    // window.location.href = "./newEntry.html";
    // return false;
        
    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);
    }

});



// >> first read data to find if item already exists -- Database.read

// >> IF DATA EXISTS -- access the same item and increment its child by given number -- Database.write

// >> IF DATA NOT EXISTS -- push the new item and create a new field for this item with given number -- Database.write


// //SECTION1
// let dataExists = undefined;

// After reading Data, if exists set dataExists = true; if not exists set dataExists = false


// //SECTION2

// if (dataExists == true){

//     >> IF DATA EXISTS-- access the same item and increment its child by given number-- Database.write
// }

// else {
//     >> IF DATA NOT EXISTS-- push the new item and create a new field for this item with given number-- Database.write
// }
















