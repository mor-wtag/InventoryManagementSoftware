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
let itemfound = false;
let uniqueKey_Array = [];
console.log('itemfound: ' + itemfound);

// RealTime listener
//this checks to see if user is logged in 
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        //User is logged in, redirect to profile page
        console.log("Already Signed in...");
        user_email = user.email;
        console.log("user_email: " + user_email);
        console.log("user: " + user.uid);
    }
    else {
        //user is not logged in, do nothing
        console.log('Not logged in...');
        window.location.href = "./login.html";
    }
});

//submit form

const dbRefObject = firebase.database().ref().child('databases'); //children of database object
const dbRefElement = dbRefObject.child('new_Entry'); //children of database object
const dbRefInventory = dbRefObject.child('Inventorydatabase'); //children of database object

//submit form

$(document).ready(function () {

    get_currentDate();

    //get the date of current day

    function get_currentDate() {
        today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        seconds = today.getTime();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = yyyy + '-' + mm + '-' + dd;
    }

    console.log("today: " + today);
    console.log("seconds: " + seconds);

    //searching for item in database
    //getting all items from the database once

    //CHECK FOR FUTURE BUGS (WHETHER GETTING ALL THE DATABASE DATA ONCE MADE ERRORS)

    let response = database.ref('databases/InventoryDatabase').once('value');

    response.then(function (snapshot) {

        let fetchedData = snapshot.val();

        // CODE FOR THE DELIVERY FORM

        //looping through each delivery form

        for (let itemAdded_index = 0; itemAdded_index < 5; itemAdded_index++) {

            let destination_found = false; //setting the boolean false here so that it reinitializes for every new item added

            let first_item_matched = false;

            ////FILTER BUTTON FOR THE ITEM CODE
            //after the filter icon being clicked, a function will be triggered where the system will look for the item code in the database return the item name and unit of measurement and fill in the respected fields

            $("#filter_itemCode" + itemAdded_index).click(function () {
                console.log("Filter item code button has been clicked!");

                //loop through and parse the data to check if the item code is present in the database
                for (let uniqueKey in fetchedData) {

                    let itemCode_filtered = fetchedData[uniqueKey]['itemCode'];
                    let itemName_filtered = fetchedData[uniqueKey]['itemName'];
                    let uom_filtered = fetchedData[uniqueKey]['uom'];
                    let quantity_filtered = fetchedData[uniqueKey]['quantity'];

                    if (itemCode_filtered == searched_itemcode) {
                        console.log('Found the item code you were looking for: ' + itemCode_filtered + ', ' + itemName_filtered + ', ' + uom_filtered);

                        //item code matched, now append the other information in the input text fields

                        $('#itemName' + itemAdded_index).val(itemName_filtered);
                        $('#uom' + itemAdded_index).val(uom_filtered);
                        $('#quantity' + itemAdded_index).val(quantity_filtered);

                    }
                    else {
                        console.log("Cannot find the item you were looking for yet: " + searched_itemcode);
                    }
                }
            });

            //FILTERING FOR ITEM NAME
            //DYNAMIC DROPDOWN

            //this code here is to filter item names and populate a dropdown table consisting of all the item names in the inventory the entered data is similar to the item searched
            //onpressing any key the filter button beside the item name

            $("#itemName" + itemAdded_index).on("keypress", function () {

                //delete the existing dropdown at the start of a keypress to avoid multiple entries on every keypress and so that the dropdown is freshly populated on every keypress

                $("#itemName_dropdown" + itemAdded_index).empty();

                //get item name from the input field
                let searched_itemName = $("#itemName" + itemAdded_index).val();

                //loop through and parse the data to check if the item name is present in the database
                for (let uniqueKey in fetchedData) {

                    let itemCode_filtered = fetchedData[uniqueKey]['itemCode'];
                    let itemName_filtered = fetchedData[uniqueKey]['itemName'];
                    let uom_filtered = fetchedData[uniqueKey]['uom'];
                    let quantity_filtered = fetchedData[uniqueKey]['quantity'];

                    //converting both to string format 

                    let string_itemName_filtered = itemName_filtered.toString();
                    let string_searched_itemName = searched_itemName.toString().toLowerCase();

                    let string_itemName_filtered_lowercase = itemName_filtered.toLowerCase();// lowercase version of the filtered string item so that it can be compared

                    //look for partial/complete match of the item Name searched string and the item name found in database string

                    if (string_itemName_filtered_lowercase.includes(string_searched_itemName)) {

                        console.log('Found the item code you were looking for: ' + string_itemName_filtered); //adding the item that's not converted to lowercase so that it can be used to get the correct information from the database

                        //checking to see whether we have found the first item that matched or its the subsequent items

                        if (first_item_matched == false) {

                            //append html code to insert dynamic dropdown select function
                            $("#itemName" + itemAdded_index).append(`<datalist id='itemName_dropdown${itemAdded_index}'></datalist>`);
                            first_item_matched = true;

                            console.log("First item appended! Dropdown injected");
                        }

                        //checked if its the first item, now add the option values

                        $("#itemName_dropdown" + itemAdded_index).append(`<option id='${string_itemName_filtered}'>${string_itemName_filtered}</option>`);

                        console.log('Items appended: ' + string_itemName_filtered);
                    }
                }
            });

            ////FILTERING FOR DESTINATION
            //STATIC DROPDOWN added by fetching data from the Destination database when the page reloads 

            //fetch the data from destination database

            let response1 = database.ref('databases/Destination_database').once('value');

            response1.then(function (snapshot) {

                let fetchedData1 = snapshot.val();

                //delete the existing dropdown at the start of a keypress to avoid multiple entries on every keypress and so that the dropdown is freshly populated on every keypress
                $("#destination_dropdown" + itemAdded_index).empty();

                //append html code to insert dynamic dropdown select function
                $("#destination" + itemAdded_index).append(`<datalist id='destination_dropdown${itemAdded_index}'></datalist>`);

                //loop through and parse the data to check if the item name is present in the database
                for (let uniqueKey in fetchedData1) {

                    let filtered_destination = fetchedData1[uniqueKey]['destination'];

                    //converting to string format 
                    let string_destination_filtered = filtered_destination.toString();

                    //checked if its the first item, now add the option values
                    $("#destination_dropdown" + itemAdded_index).append(`<option id='${string_destination_filtered}'>${string_destination_filtered}</option>`);
                }
            });

            //////FILTERING FOR UOM
            //STATIC DROPDOWN added by fetching data from the uom_database when the page reloads 

            //fetch the data from UOM database

            let response2 = database.ref('databases/uom_database').once('value');

            response2.then(function (snapshot) {

                let fetchedData2 = snapshot.val();

                //delete the existing dropdown at the start of a keypress to avoid multiple entries on every keypress and so that the dropdown is freshly populated on every keypress
                $("#uom_dropdown" + itemAdded_index).empty();

                //append html code to insert dynamic dropdown select function
                $("#uom" + itemAdded_index).append(`<datalist id='uom_dropdown${itemAdded_index}'></datalist>`);

                //loop through and parse the data to check if the item name is present in the database
                for (let uniqueKey in fetchedData2) {

                    let filtered_uom = fetchedData2[uniqueKey]['uom'];

                    //converting to string format 
                    let string_uom_filtered = filtered_uom.toString();

                    //checked if its the first item, now add the option values
                    $("#uom_dropdown" + itemAdded_index).append(`<option id='${string_uom_filtered}'>${string_uom_filtered}</option>`);
                }
            });

            //this is the code to get the selected item from the dropdown list and then get the itemcode, quantity, uom from the database
            $('#filter_itemName' + itemAdded_index).click(function () {

                //triggering the onChange function after all the items have been appended into the dropdown list

                let selected_itemName = $("#itemName" + itemAdded_index).val();
                console.log("The selected item is: " + selected_itemName);

                //looping through the database in order to find the item information of the item selected

                for (let uniqueKey in fetchedData) {

                    let itemCode_filtered = fetchedData[uniqueKey]['itemCode'];
                    let itemName_filtered = fetchedData[uniqueKey]['itemName'];
                    let uom_filtered = fetchedData[uniqueKey]['uom'];
                    let quantity_filtered = fetchedData[uniqueKey]['quantity'];

                    if (itemName_filtered == selected_itemName) {

                        //item code matched, now append the other information in the input text fields

                        $('#itemCode' + itemAdded_index).val(itemCode_filtered);
                        $('#uom' + itemAdded_index).val(uom_filtered);
                        $('#quantity' + itemAdded_index).val(quantity_filtered);
                    }

                }
            });

            //on clicking the submit delivery item button
            // Form Submission

            $("#form_delivery" + itemAdded_index).submit(function (config) {

                let submitButtonClicked = "#form_delivery" + itemAdded_index; //to know which form is the current form

                //take value of the item code and item name to compare later

                let searched_itemcode = $("#itemCode" + itemAdded_index).val();
                let searched_itemName = $("#itemName" + itemAdded_index).val();
                let searched_destination = $("#destination" + itemAdded_index).val();

                console.log('The submit button that has een clicked has the id: ' + submitButtonClicked);

                //after knowing which submit button has been clicked, loop through and convert each form entry into a JSON to be pushed into the database later 

                for (let form_fields_index = 0; form_fields_index <= itemAdded_index; form_fields_index++) {

                    let itemCode = $("#itemCode" + form_fields_index).val();
                    let itemName = $("#itemName" + form_fields_index).val();
                    let uom = $("#uom" + form_fields_index).val();
                    let quantity = $("#quantity" + form_fields_index).val();
                    let destination = $('#destination' + form_fields_index).val();
                    let issueDate = $("#issueDate" + form_fields_index).val();

                    $(this), console.log("Submit to Firebase");

                    //adding data instead of replacing with the new value
                    // Saving the user input into JSON format

                    //FOR DELIVERY LOG

                    let update_data_delivery_log =
                    {
                        'itemCode': itemCode,
                        'itemName': itemName,
                        'uom': uom,
                        'quantity': quantity,
                        'destination': destination,
                        'issueDate': issueDate,
                        'user_email': user_email,
                        'current_date': today
                    };

                    console.log(update_data_delivery_log);

                    // //check to see if the data is present in the inventory
                    //READING FROM FIREBASE DATABASE

                    //loop through and parse the data then create TR in the table with this data
                    for (let uniqueKey in fetchedData) {

                        let itemCode_fetched = fetchedData[uniqueKey]['itemCode'];
                        let existingQuantity = fetchedData[uniqueKey]['quantity'];

                        if (itemCode_fetched == itemCode) {

                            //THIS MEANS ITEM EXISTS IN DATABASE SO JUST INCREMENT IT BY QUANTITY
                            let newQuantity = parseInt(existingQuantity) - parseInt(quantity);

                            console.log("New Updated Quantity: " + newQuantity);

                            let data = {
                                'quantity': newQuantity
                            }

                            itemfound = true;

                            let updating_inventory = database.ref('databases/InventoryDatabase/' + uniqueKey).update(data).then(function () {

                                //push item in the delivery log database
                                let update_delivery_log = database.ref('databases/delivery_log').push(update_data_delivery_log);
                            });
                        }      
                    }

                    if (itemfound == false) {
                        // THIS MEANS ITEM DOES NOT EXIST IN DATASBE SO JUST SET IT TO A NEW ITEM WITH QUANTITY
                        // pushing the inventory data

                        alert("Could not find the item " + itemName + " in the inventory! Please check if the item code is correct.");
                        return false;
                    }

                    //CODE TO CHECK IF DESTINATION IS PRESENT IN THE DATABASE
                    //If destination not prresent in database, add it to the database

                    //retrieve data from destination database
                    let response3 = database.ref('databases/Destination_database').once('value');

                    response3.then(function (snapshot) {

                        let fetchedData3 = snapshot.val();

                        console.log("Got into the function to add to the DESTINATION DATABASE if it's not already there");

                        //loop through and parse the data then create TR in the table with this data
                        for (let uniqueKey in fetchedData3) {

                            let filtered_destination = fetchedData3[uniqueKey]['destination'];

                            //look for partial/complete match of the item Name searched string and the item name found in database string

                            if (filtered_destination==destination) {

                                console.log("destination found! "+destination);
                                destination_found=true;
                                break;
                            }
                        }

                        if (destination_found==false){

                            //since destination cannot be found in the database, as the user whether they want to add the destination into the database
                            //alert with two options OKAY and CANCEL

                            let add_destination_into_database = confirm("Cannot find the destination "+destination+". Would you like to add the destination into the database?");

                            if (add_destination_into_database==true){
                                //will be triggered if the user clicks OK
                                //hence add the destinmation into the database
                                console.log("destination Not found! "+destination+". Appening destination into the destination database");

                                let destination_to_be_pushed =
                                {
                                    'destination': destination
                                }

                                let update_Destination_database =  database.ref('databases/Destination_database').push(destination_to_be_pushed); //push new destination into database
                            }      
                            else{
                                return false;
                            }                     
                        }

                        //this code here is to check data is being taken from the last form. If that's the case, then the forms can be taken and success alert will be given

                        if (form_fields_index == itemAdded_index) {
                            alert('Data uploaded Successfully!');
                            location.reload();
                            return false;
                        }
    
                        itemfound = false;
                    });
                }
            });

            //CODE FOR ADDING A NEW ITEM 

            //when the add new item button is clicked, this function will append the same form below the existing form, filling up some of the common input fields with the information existing in the current item entry form

            $('#add_delivery' + itemAdded_index).click(function () {

                $('#form_delivery' + itemAdded_index).css('display', 'block');
                $('#submit_delivery' + itemAdded_index).css('display', 'none');
                $('#add_delivery' + itemAdded_index).css('display', 'none');

                //this code here is to hide a form when the close button is clicked

                $("#hide_form" + itemAdded_index).click(function () {
                    $('#form_delivery' + itemAdded_index).css('display', 'none');
                    $('#submit_delivery' + itemAdded_index).css('display', 'inline-block');
                    $('#add_delivery' + itemAdded_index).css('display', 'inline-block');
                });
            });
        }
    });

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/delivery_log').once('value').then(function (snapshot) {

        let fetchedData = snapshot.val();
        console.log(fetchedData);

        //Code in order to show the last entry first (LAST IN FIRST OUT)

        //loop through unique keys and create an array in order to view get all the unique keys
        let uniqueKeyArray_index = 0;
        for (let uniqueKey in fetchedData) {
            uniqueKey_Array[uniqueKeyArray_index] = uniqueKey;
            uniqueKeyArray_index++;
        }

        console.log('uniqueKey_Array: ' + uniqueKey_Array);

        //from the unique key array, reverse it and set each variable so that the fetched data from that unique key can be found

        for (let reversed_uniqueKey_index = uniqueKey_Array.length - 1; reversed_uniqueKey_index >= 0; reversed_uniqueKey_index--) {
            let reversed_uniqueKey = uniqueKey_Array[reversed_uniqueKey_index];

            //loop through and parse the data then create TR in the table with this data
            // for (let uniqueKey in fetchedData){

            //reversing the key value in the database so that the last entry shows up first
            let itemCode = fetchedData[reversed_uniqueKey]['itemCode'];
            let itemName = fetchedData[reversed_uniqueKey]['itemName'];
            let uom = fetchedData[reversed_uniqueKey]['uom'];
            let quantity = fetchedData[reversed_uniqueKey]['quantity'];
            let destination = fetchedData[reversed_uniqueKey]['destination'];
            let issueDate = fetchedData[reversed_uniqueKey]['issueDate'];
            let user_email = fetchedData[reversed_uniqueKey]['user_email'];
            let current_date = fetchedData[reversed_uniqueKey]['current_date'];

            // appending elements into the databaseTable
            $('#delivery_log_tableBody').append(/*html*/`
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
                                    ${destination}
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

        //----EVENT LISTENER FOR SEARCH FIELD IN INVENTORY----

        //this code here is for dynamically searching (on key press) for the item in the inventory
        //as the user will be searching, the table will keep populating and appending similar items like the dropdown created previously 

        $("#search_delivery").on("keydown" && "keyup", function () {

            //on erasing the search field, the table needs to repopulate again with all the inventory items

            console.log("Got inside the search function");

            $('#delivery_log_tableBody').empty();  //emptying the table so that sorted values can be appended

            //get item name from the input field
            let search_delivery = $("#search_delivery").val();

            //loop through unique keys and create an array in order to view get all the unique keys
            let uniqueKeyArray_index = 0;
            for (let uniqueKey in fetchedData) {
                uniqueKey_Array[uniqueKeyArray_index] = uniqueKey;
                uniqueKeyArray_index++;
            }

            console.log('uniqueKey_Array: ' + uniqueKey_Array);

            //from the unique key array, reverse it and set each variable so that the fetched data from that unique key can be found

            for (let reversed_uniqueKey_index = uniqueKey_Array.length - 1; reversed_uniqueKey_index >= 0; reversed_uniqueKey_index--) {
                let reversed_uniqueKey = uniqueKey_Array[reversed_uniqueKey_index];

                //loop through and parse the data then create TR in the table with this data
                // for (let uniqueKey in fetchedData){

                //reversing the key value in the database so that the last entry shows up first
                let itemCode = fetchedData[reversed_uniqueKey]['itemCode'];
                let itemName = fetchedData[reversed_uniqueKey]['itemName'];
                let uom = fetchedData[reversed_uniqueKey]['uom'];
                let quantity = fetchedData[reversed_uniqueKey]['quantity'];
                let destination = fetchedData[reversed_uniqueKey]['destination'];
                let issueDate = fetchedData[reversed_uniqueKey]['issueDate'];
                let user_email = fetchedData[reversed_uniqueKey]['user_email'];
                let current_date = fetchedData[reversed_uniqueKey]['current_date'];

                let string_itemName_filtered = itemName.toString();

                let string_searched_itemName = search_delivery.toString().toLowerCase();

                let string_itemName_filtered_lowercase = string_itemName_filtered.toLowerCase();// lowercase version of the filtered string item so that it can be compared

                //look for partial/complete match of the item Name searched string and the item name found in database string

                if (string_itemName_filtered_lowercase.includes(string_searched_itemName)) {

                    console.log('Found the item code you were looking for: ' + string_itemName_filtered); //adding the item that's not converted to lowercase so that it can be used to get the correct information from the database
                    // appending elements into the databaseTable
                    // appending elements into the databaseTable
                    $('#delivery_log_tableBody').append(/*html*/`
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
                                        ${destination}
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
            }
        });

        //PICKING DATE RANGE
        //This code here to select a date range according to which the data will be viewed later

        (function($) {
            function compareDates(startDate, endDate, format) {
              var temp, dateStart, dateEnd;
              try {
                dateStart = $.datepicker.parseDate(format, startDate);
                dateEnd = $.datepicker.parseDate(format, endDate);
                if (dateEnd < dateStart) {
                  temp = startDate;
                  startDate = endDate;
                  endDate = temp;
                }
              } catch (ex) {}
              return { start: startDate, end: endDate };
            }
          
            $.fn.dateRangePicker = function (options) {
              options = $.extend({
                "changeMonth": false,
                "changeYear": false,
                "numberOfMonths": 2,
                "rangeSeparator": " - ",
                      "useHiddenAltFields": false
              }, options || {});
          
                  var myDateRangeTarget = $(this);
              var onSelect = options.onSelect || $.noop;
              var onClose = options.onClose || $.noop;
              var beforeShow = options.beforeShow || $.noop;
              var beforeShowDay = options.beforeShowDay;
              var lastDateRange;
          
              function storePreviousDateRange(dateText, dateFormat) {
                var start, end;
                dateText = dateText.split(options.rangeSeparator);
                if (dateText.length > 0) {
                  start = $.datepicker.parseDate(dateFormat, dateText[0]);
                  if (dateText.length > 1) {
                    end = $.datepicker.parseDate(dateFormat, dateText[1]);
                  }
                  lastDateRange = {start: start, end: end};
                } else {
                  lastDateRange = null;
                }
              }
                  
              options.beforeShow = function(input, inst) {
                var dateFormat = myDateRangeTarget.datepicker("option", "dateFormat");
                storePreviousDateRange($(input).val(), dateFormat);
                beforeShow.apply(myDateRangeTarget, arguments);
              };
                  
              options.beforeShowDay = function(date) {
                var out = [true, ""], extraOut;
                if (lastDateRange && lastDateRange.start <= date) {
                  if (lastDateRange.end && date <= lastDateRange.end) {
                    out[1] = "ui-datepicker-range";
                  }
                }
          
                if (beforeShowDay) {
                  extraOut = beforeShowDay.apply(myDateRangeTarget, arguments);
                  out[0] = out[0] && extraOut[0];
                  out[1] = out[1] + " " + extraOut[1];
                  out[2] = extraOut[2];
                }
                return out;
              };
          
              options.onSelect = function(dateText, inst) {
                var textStart;
                if (!inst.rangeStart) {
                  inst.inline = true;
                  inst.rangeStart = dateText;
                } else {
                  inst.inline = false;
                  textStart = inst.rangeStart;
                  if (textStart !== dateText) {
                    var dateFormat = myDateRangeTarget.datepicker("option", "dateFormat");
                    var dateRange = compareDates(textStart, dateText, dateFormat);
                    myDateRangeTarget.val(dateRange.start + options.rangeSeparator + dateRange.end);
                    inst.rangeStart = null;
                              if (options.useHiddenAltFields){
                                  var myToField = myDateRangeTarget.attr("data-to-field");
                                  var myFromField = myDateRangeTarget.attr("data-from-field");
                                  $("#"+myFromField).val(dateRange.start);
                                  $("#"+myToField).val(dateRange.end);
                              }
                  }
                }
                onSelect.apply(myDateRangeTarget, arguments);
              };
          
              options.onClose = function(dateText, inst) {
                inst.rangeStart = null;
                inst.inline = false;
                onClose.apply(myDateRangeTarget, arguments);
              };
          
              return this.each(function() {
                if (myDateRangeTarget.is("input")) {
                  myDateRangeTarget.datepicker(options);
                }
                // myDateRangeTarget.wrap("<div class=\"dateRangeWrapper\"></div>");
              });
            };
          }(jQuery));

          //AFTER CLICKING THE DATE RANGE ICON.
        //This code will take the values and show the data for the selected date range

        $("#dateRange_icon").click(function(){

            $('#delivery_log_tableBody').empty(); //emptying before appending data

            console.log("Date range icon Clicked!");

            //taking the value from the input fields
            let startDate = $("#txtDateFrom").val();
            let endDate = $("#txtDateTo").val();

            console.log("startDate: "+startDate);
            console.log("endDate: "+endDate);

            // Returns an array of dates between the two dates
            var getDates = function(startDate, endDate) {
                var dates = [],
                    currentDate = startDate,
                    addDays = function(days) {
                    var date = new Date(this.valueOf());
                    date.setDate(date.getDate() + days);
                    return date;
                    };
                    while (currentDate <= endDate) {
                    dates.push(currentDate);
                    currentDate = addDays.call(currentDate, 1);
                    }
                    return dates;
            };

            // Calling function getDates
            //Function returns all the dates between the start date and end date
            var dates = getDates(new Date(startDate), new Date(endDate));                                                                                                           
            dates.forEach(function(date) {
                let dd = date.getDate();
                let mm = date.getMonth()+1;
                let yyyy = date.getFullYear();

                if(dd<10) {
                    dd = '0'+dd
                } 
            
                if(mm<10) {
                    mm = '0'+mm
                } 
            
                let finalDate = yyyy + '-' + mm + '-' + dd;
                console.log(finalDate);

                //Now take the dates and search for them in the datebase
                //search in database
                for (let uniqueKey in fetchedData){
                    
                    let issueDate = fetchedData[uniqueKey]['issueDate'];

                    if (issueDate==finalDate){
                        console.log("Date matched!! "+issueDate);

                        //reversing the key value in the database so that the last entry shows up first
                        let itemCode = fetchedData[uniqueKey]['itemCode'];
                        let itemName = fetchedData[uniqueKey]['itemName'];
                        let uom = fetchedData[uniqueKey]['uom'];
                        let quantity = fetchedData[uniqueKey]['quantity'];
                        let user_email = fetchedData[uniqueKey]['user_email'];
                        let current_date = fetchedData[uniqueKey]['current_date'];
                        let destination = fetchedData[uniqueKey]['destination'];

                        let user_name = user_email.split("@"); //split the array so that you can display the name before the @ domain

                        // appending elements into the databaseTable
                        $('#delivery_log_tableBody').append(/*html*/`
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
                                ${destination}
                            </td>
                            <td>
                                ${issueDate}
                            </td>
                            <td>
                                ${user_name[0]}
                            </td>
                            <td>
                                ${current_date}
                            </td>
                        </tr>
                    `);
                    }
                }
            });
        });

        //EXPORT TABLE TO EXCEL FILE

        $("#exportToExcel_delivery").click(function(){

            $("#exportToExcel_delivery").css('color','white');

            //creating a workbook from the table
            var wb = XLSX.utils.table_to_book(document.getElementById('deliveryLog_table'), {sheet:"Sheet JS"});
            //writing the binary type data
            var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
            //function to parse the table
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i<s.length; i++) 
                    view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
            }
                //saving file downloading
                saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Delivery Log.xlsx');
        });

        $(document).ready(function(){
            $("#txtDateRange").dateRangePicker({
                showOn: "focus",
                rangeSeparator: " to ",
                dateFormat: "mm-dd-yy",
                useHiddenAltFields: true,
                constrainInput: true
            });
      });
    });


    //PUSHING DATA INTO THE DESTINATION DATABASE
    //WILL BE RUN ONLY ONCE

//     let destination1= {
//         'destination': 'Comilla GPC'
//     }

//     let destination2= {
//         'destination': 'Jassore GPC'
//     }

//     let destination3= {
//         'destination': 'UK Warehouse'
//     }

//     let destination4= {
//         'destination': 'Rajshahi Regional Office'
//     }

//     let destination5= {
//         'destination': 'Gulshan GPC'
//     }

//     let update_Destination_database =  database.ref('databases/Destination_database').push(destination1);
//     update_Destination_database =  database.ref('databases/Destination_database').push(destination2);
//     update_Destination_database =  database.ref('databases/Destination_database').push(destination3);
//     update_Destination_database =  database.ref('databases/Destination_database').push(destination4);
//     update_Destination_database =  database.ref('databases/Destination_database').push(destination5);

    // PUSHING DATA INTO THE DESTINATION DATABASE
    //     WILL BE RUN ONLY ONCE

//         let uom1= {
//             'uom': 'feet'
//         }

//         let uom2= {
//             'uom': 'meter'
//         }

//         let uom3= {
//             'uom': 'pcs'
//         }

//         let uom4= {
//             'uom': 'sq M'
//         }

//         let uom5= {
//             'uom': 'job'
//         }

//         let uom6= {
//             'uom': 'cu.M'
//         }

//         let uom7= {
//             'uom': 'sets'
//         }

//         let uom8= {
//             'uom': 'coil'
//         }

//         let uom9= {
//             'uom': 'no.'
//         }

//         let uom10= {
//             'uom': 'litre'
//         }

        

//         let update_Destination_database =  database.ref('databases/uom_database').push(uom1);
//         update_Destination_database =  database.ref('databases/uom_database').push(uom2);
//         update_Destination_database =  database.ref('databases/uom_database').push(uom3);
//         update_Destination_database =  database.ref('databases/uom_database').push(uom4);
//         update_Destination_database =  database.ref('databases/uom_database').push(uom5);
//         update_Destination_database =  database.ref('databases/uom_database').push(uom6);
//         update_Destination_database =  database.ref('databases/uom_database').push(uom7);
//         update_Destination_database =  database.ref('databases/uom_database').push(uom8);
//         update_Destination_database =  database.ref('databases/uom_database').push(uom9);
//         update_Destination_database =  database.ref('databases/uom_database').push(uom10);
        
});

