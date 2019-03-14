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

    //searching realtime database
    //checking to see if the item code is present in the database already

    // var searchForItemCode = database.ref('databases/new_Entry').once('value').

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/entry_log').orderByChild("seconds").once('value').then(function(snapshot){

        let fetchedData = snapshot.val();
        console.log(fetchedData);

        //loop through and parse the data then create TR in the table with this data
        for (let uniqueKey in fetchedData){

            //reversing the key value in the database so that the last entry shows up first
            let itemCode = fetchedData[uniqueKey]['itemCode'];
            let itemName = fetchedData[uniqueKey]['itemName'];
            let uom = fetchedData[uniqueKey]['uom'];
            let quantity = fetchedData[uniqueKey]['quantity'];
            let unitRate = fetchedData[uniqueKey]['unitRate'];
            let totalAmount = fetchedData[uniqueKey]['totalAmount'];
            let mainContract = fetchedData[uniqueKey]['mainContract'];
            let mainVendor = fetchedData[uniqueKey]['mainVendor'];
            let novatedContract = fetchedData[uniqueKey]['novatedContract'];
            let novatedVendor = fetchedData[uniqueKey]['novatedVendor'];
            let PRnum = fetchedData[uniqueKey]['PRnum'];
            let POnum = fetchedData[uniqueKey]['POnum'];
            let delChalNum = fetchedData[uniqueKey]['delChalNum'];
            let issueDate = fetchedData[uniqueKey]['issueDate'];
            let user_email = fetchedData[uniqueKey]['user_email'];
            let current_date = fetchedData[uniqueKey]['current_date'];
            let seconds = fetchedData[uniqueKey]['seconds'];

            // appending elements into the databaseTable
            $('#table-1').append(/*html*/`
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
