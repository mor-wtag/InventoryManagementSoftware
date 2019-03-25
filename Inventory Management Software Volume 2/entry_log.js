//this file will work with entry_log.html


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
let today;

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

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/entry_log').once('value').then(function(snapshot){

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

            //reversing the key value in the database so that the last entry shows up first
            let itemCode = fetchedData[reversed_uniqueKey]['itemCode'];
            let itemName = fetchedData[reversed_uniqueKey]['itemName'];
            let uom = fetchedData[reversed_uniqueKey]['uom'];
            let quantity = fetchedData[reversed_uniqueKey]['quantity'];
            let unitRate = fetchedData[reversed_uniqueKey]['unitRate'];
            let totalAmount = fetchedData[reversed_uniqueKey]['totalAmount'];
            let mainContract = fetchedData[reversed_uniqueKey]['mainContract'];
            let mainVendor = fetchedData[reversed_uniqueKey]['mainVendor'];
            let novatedContract = fetchedData[reversed_uniqueKey]['novatedContract'];
            let novatedVendor = fetchedData[reversed_uniqueKey]['novatedVendor'];
            let PRnum = fetchedData[reversed_uniqueKey]['PRnum'];
            let POnum = fetchedData[reversed_uniqueKey]['POnum'];
            let delChalNum = fetchedData[reversed_uniqueKey]['delChalNum'];
            let issueDate = fetchedData[reversed_uniqueKey]['issueDate'];
            let user_email = fetchedData[reversed_uniqueKey]['user_email'];
            let current_date = fetchedData[reversed_uniqueKey]['current_date'];
            let seconds = fetchedData[reversed_uniqueKey]['seconds'];

            // appending elements into the databaseTable
            $('#table-1').append(/*html*/`
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
                        ${unitRate}
                    </td>
                    <td>
                        ${totalAmount}
                    </td>
                    <td>
                        ${mainContract}
                    </td>
                    <td>
                        ${mainVendor}
                    </td>
                    <td>
                        ${novatedContract}
                    </td>
                    <td>
                        ${novatedVendor}
                    </td>
                    <td>
                        ${PRnum}
                    </td>
                    <td>
                        ${POnum}
                    </td>
                    <td>
                        ${delChalNum}
                    </td>
                    <td>
                        ${issueDate}
                    </td>
                    <td>
                        ${user_email}
                    </td>
                    <td>
                        ${current_date}
                    </td>
                </tr>
            `);

        }
    });
}
