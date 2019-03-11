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

//submit form

$(document).ready(function () {

    get_currentDate();

    //get the date of current day

    function get_currentDate(){
        today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
    
        if(dd<10) {
            dd = '0'+dd
        } 
    
        if(mm<10) {
            mm = '0'+mm
        } 
    
        today = yyyy + '-' + mm + '-' + dd;
    }
    
    console.log("today: "+today);

    $("#submit_newEntry").click(function () {

        //saving the values of the form from the front end

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
                'current_date': today
            };

            //updating the database of New Enty in Firebase Console

            let pushing_newEntry = dbRefElement.push(update_data_newEntry).then(function (user) {

                alert('Data uploaded Successfully!');
                window.location.href = "./newEntry.html";
                return false;
    
            }, function (err) {
    
                Error_String = err.code.substr(5);
                alert('Data could not be uploaded' + ' | Error: ' +  Error_String);
    
            });
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
    });


    function filePicked(oEvent) {
        // Get The File From The Input
        var oFile = oEvent.target.files[0];
        var sFilename = oFile.name;
        let heading = ['itemCode','itemName','uom' ,'quantity','unitRate','totalAmount','mainContract','mainVendor','novatedContract','novatedVendor','PRnum','POnum','delChalNum','issueDate'];
        // Create A File Reader HTML5
        var reader = new FileReader();
        
        // Ready The Event For When A File Gets Selected
        reader.onload = function(e) {
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
                    let pushing_newEntry = dbRefElement.push(update_data_newEntry).then(function (user) {

                        alert('Data uploaded Successfully!');
                        window.location.href = "./newEntry.html";
                        return false;
            
                    }, function (err) {
            
                        Error_String = err.code.substr(5);
                        alert('Data could not be uploaded' + ' | Error: ' +  Error_String);
            
                    });
                }); 
            });
        };
        
        // Tell JS To Start Reading The File.. You could delay this if desired
        reader.readAsBinaryString(oFile);
    }
});