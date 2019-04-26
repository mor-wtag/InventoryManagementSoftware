//this file is to work with the delivery.html PAGE portion of authentication

//submit form
function initialLoad() {

    //Initializing variables after loading page

    let user_email;
    let today;
    let totalAmount;
    let itemfound = false;
    let uniqueKey_Array = [];
    let itemfound_Delivery = false;
    let destination_array = [];
    console.log('itemfound: ' + itemfound);

    const dbRefObject = firebase.database().ref().child('databases'); //children of database object

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

                let itemfound = "itemfound" + itemAdded_index; //creating a dynamic boolean 

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

                    //FOR DELIVERY DATABASE
                    let update_data_delivery = {
                        'itemCode': itemCode,
                        'itemName': itemName,
                        'uom': uom,
                        'quantity': quantity
                    };

                    console.log(update_data_delivery_log);

                    // //check to see if the data is present in the inventory
                    //READING FROM FIREBASE DATABASE

                    //loop through and parse the data then create TR in the table with this data
                    for (let uniqueKey in fetchedData) {

                        let itemCode_fetched = fetchedData[uniqueKey]['itemCode'];
                        let existingQuantity = fetchedData[uniqueKey]['quantity'];

                        if (itemCode_fetched == itemCode) {

                            if (parseInt(existingQuantity) > 0 && parseInt(existingQuantity) >= parseInt(quantity)) {

                                //THIS MEANS ITEM EXISTS IN DATABASE SO JUST INCREMENT IT BY QUANTITY
                                let newQuantity = parseInt(existingQuantity) - parseInt(quantity);

                                console.log("New Updated Quantity: " + newQuantity);

                                let data = {
                                    'quantity': newQuantity
                                }

                                itemfound = true;

                                let updating_inventory = database.ref('databases/InventoryDatabase/' + uniqueKey).update(data).then(function () {

                                    //push item in the delivery log database
                                    let update_delivery_log = database.ref('databases/delivery_log').push(update_data_delivery_log).then(function () {
                                        alert("Item delivered successfully!");
                                    });
                                });
                            }
                        }
                    }

                    if (itemfound == false) {
                        // THIS MEANS ITEM DOES NOT EXIST IN DATASBE SO JUST SET IT TO A NEW ITEM WITH QUANTITY
                        // pushing the inventory data

                        alert("Could not find the item " + itemName + " in the inventory! Please check if the item code is correct.");
                        return false;
                    }

                    //CHECKING FOR ITEMS IN THE DELIVERY DATABASE
                    let response4 = database.ref('databases/DeliveryDatabase').once('value');

                    response4.then(function (snapshot) {

                        console.log('itemfound: ' + itemfound);

                        let fetchedData_delivery = snapshot.val();

                        //loop through and parse the data then create TR in the table with this data
                        for (let uniqueKey in fetchedData_delivery) {

                            let itemCode_fetched_delivery = fetchedData_delivery[uniqueKey]['itemCode'];
                            let existingQuantity_delivery = fetchedData_delivery[uniqueKey]['quantity'];

                            if (itemCode_fetched_delivery == itemCode) {

                                //THIS MEANS ITEM EXISTS IN DATABASE SO JUST INCREMENT IT BY QUANTITY
                                let newQuantity_delivery = parseInt(quantity) + parseInt(existingQuantity_delivery);

                                let data = {
                                    'quantity': newQuantity_delivery
                                }

                                itemfound_Delivery = true;

                                let updating_inventory = database.ref('databases/DeliveryDatabase/' + uniqueKey).update(data).then(function () {
                                });
                            }
                        }
                        if (itemfound_Delivery == false) {
                            // THIS MEANS ITEM DOES NOT EXIST IN DATASBE SO JUST SET IT TO A NEW ITEM WITH QUANTITY
                            // pushing the inventory data

                            let pushing_delivery = database.ref('databases/DeliveryDatabase/').push(update_data_delivery).then(function () {
                            });

                        }
                    });


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
                            let quantity_destination = fetchedData3[uniqueKey]['quantity'];

                            //look for partial/complete match of the item Name searched string and the item name found in database string

                            if (filtered_destination == destination) {

                                console.log("destination found! " + destination);
                                destination_found = true;

                                newQuantity = parseInt(quantity) + parseInt(quantity_destination);
                                let quantity_data =
                                {
                                    quantity: newQuantity
                                }
                                //updating the quantity in the destination database for the destinations present in te database
                                let update_quantity_in_destination_database = database.ref('databases/Destination_database/' + uniqueKey).update(quantity_data).then(function () {
                                    break;
                                });

                            }
                        }

                        if (destination_found == false) {

                            //since destination cannot be found in the database, as the user whether they want to add the destination into the database
                            //alert with two options OKAY and CANCEL

                            let add_destination_into_database = confirm("Cannot find the destination " + destination + ". Would you like to add the destination into the database?");

                            if (add_destination_into_database == true) {
                                //will be triggered if the user clicks OK
                                //hence add the destinmation into the database
                                console.log("destination Not found! " + destination + ". Appending destination into the destination database");

                                let destination_to_be_pushed =
                                {
                                    'destination': destination,
                                    'quantity': quantity
                                }
                                //push new destination into database
                                let update_Destination_database = database.ref('databases/Destination_database').push(destination_to_be_pushed);
                            }
                            else {
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

        let fetchedData_deliveryLog = snapshot.val();
        console.log(fetchedData_deliveryLog);

        //APPEND ITEMS TO TABLE FUNCTION
        function appendItemsIntoTable(uniqueKey, fetchedData, tableToAppendData) {

            //reversing the key value in the database so that the last entry shows up first
            let itemCode = fetchedData[uniqueKey]['itemCode'];
            let itemName = fetchedData[uniqueKey]['itemName'];
            let uom = fetchedData[uniqueKey]['uom'];
            let quantity = fetchedData[uniqueKey]['quantity'];
            let destination = fetchedData[uniqueKey]['destination'];
            let issueDate = fetchedData[uniqueKey]['issueDate'];
            let user_email = fetchedData[uniqueKey]['user_email'];
            let current_date = fetchedData[uniqueKey]['current_date'];

            let user_name = user_email.split("@"); //split the array so that you can display the name before the @ domain

            // appending elements into the databaseTable
            tableToAppendData.append(/*html*/`
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
                    <td>
                        <div class="icon" id="edit_data_icon_${uniqueKey}" style="display:inline-block; padding:5%;"><i class="fas fa-edit"></i></div>
                        <div class="icon" id="delete_data_icon_${uniqueKey}" style="display:inline-block; padding:5%;"><i class="fas fa-trash-alt"></i></div>
                    </td>
                </tr>
            `);
        }

        //Code in order to show the last entry first (LAST IN FIRST OUT)

        //loop through unique keys and create an array in order to view get all the unique keys
        let uniqueKeyArray_index = 0;
        for (let uniqueKey in fetchedData_deliveryLog) {
            uniqueKey_Array[uniqueKeyArray_index] = uniqueKey;
            uniqueKeyArray_index++;
        }

        console.log('uniqueKey_Array: ' + uniqueKey_Array);

        //from the unique key array, reverse it and set each variable so that the fetched data from that unique key can be found

        for (let reversed_uniqueKey_index = uniqueKey_Array.length - 1; reversed_uniqueKey_index >= 0; reversed_uniqueKey_index--) {

            let reversed_uniqueKey = uniqueKey_Array[reversed_uniqueKey_index];
            let tableToAppendData = $("#delivery_log_tableBody");
            let fetchedData = fetchedData_deliveryLog;

            //loop through and parse the data then create TR in the table with this data
            appendItemsIntoTable(reversed_uniqueKey, fetchedData, tableToAppendData);
            
             //---EVENT LISTENER FOR CLICKING ON EDIT/ DELETE DATA ICON

            //DELETE
            $(`#delete_data_icon_${reversed_uniqueKey}`).click(function(){

                console.log("CLICKED DELETE ICON WITH UNIQUE KEY: "+reversed_uniqueKey);

                let itemName = fetchedData_deliveryLog[reversed_uniqueKey]['itemName'];
                let quantity = fetchedData_deliveryLog[reversed_uniqueKey]['quantity'];

                //Alert and Ask the user to confirm if they want to delete the data from the table
                let delete_row = confirm(`Are you sure you want to delete item ${itemName} with quantity ${quantity} from the table?`);

                //if the user clicks ok
                if (delete_row== true){

                    //remove bode with unique key from ENTRY_LOG Database
                    database.ref('databases/delivery_log/'+reversed_uniqueKey).remove().then(function(){

                        //update inventory database
                        //have to add the deleted item with the same quantity
                        update_inventory_database(itemName, quantity);
                    });
                }
                //if user clicks cancel
                else{
                    return false;
                }
            });

            //function to update inventory
            function update_inventory_database(itemName, quantity){

                console.log("...Deleted row, now updating inventory...");
                console.log("itemName: "+itemName);
                console.log("quantity: "+quantity);

                //fetch data from inventory database to get quantity of the item
                database.ref('databases/InventoryDatabase').once('value').then(function(snapshot){

                    let fetchedData_inventory = snapshot.val();

                    for (let uniqueKey in fetchedData_inventory){

                        let itemName_inventory = fetchedData_inventory[uniqueKey]['itemName'];
                        let quantity_inventory = fetchedData_inventory[uniqueKey]['quantity'];

                        //if item names match
                        if (itemName_inventory == itemName){

                            console.log("ITEM NAMES MATCHED!");

                            //update quantity by adding back the subtracted quantity
                            let updatedQuantity = parseInt(quantity_inventory) + parseInt(quantity);
                            
                            let update_inventory=
                            {
                                'quantity': updatedQuantity
                            }
                            //now update inventory database
                            database.ref('databases/InventoryDatabase/' + uniqueKey).update(update_inventory).then(function(){
                                window.location.reload();
                            });
                        }
                    }
                });

            }
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

            //from the unique key array, reverse it and set each variable so that the fetched data from that unique key can be found

            for (let reversed_uniqueKey_index = uniqueKey_Array.length - 1; reversed_uniqueKey_index >= 0; reversed_uniqueKey_index--) {

                //reversing the key value in the database so that the last entry shows up first
                let reversed_uniqueKey = uniqueKey_Array[reversed_uniqueKey_index];
                
                let itemName = fetchedData_deliveryLog[reversed_uniqueKey]['itemName'];

                //converting values to String
                let string_itemName_filtered = itemName.toString();
                let string_searched_itemName = search_delivery.toString().toLowerCase();
                let string_itemName_filtered_lowercase = string_itemName_filtered.toLowerCase();// lowercase version of the filtered string item so that it can be compared

                //look for partial/complete match of the item Name searched string and the item name found in database string

                if (string_itemName_filtered_lowercase.includes(string_searched_itemName)) {

                    console.log('Found the item code you were looking for: ' + string_itemName_filtered); //adding the item that's not converted to lowercase so that it can be used to get the correct information from the database

                    let tableToAppendData = $("#delivery_log_tableBody");
                    let fetchedData = fetchedData_deliveryLog;
                    
                    //loop through and parse the data then create TR in the table with this data
                    appendItemsIntoTable(reversed_uniqueKey, fetchedData, tableToAppendData);

                }
            }
        });


        //PICKING DATE RANGE
        //This code here to select a date range according to which the data will be viewed later

        (function ($) {
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
                } catch (ex) { }
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
                        lastDateRange = { start: start, end: end };
                    } else {
                        lastDateRange = null;
                    }
                }

                options.beforeShow = function (input, inst) {
                    var dateFormat = myDateRangeTarget.datepicker("option", "dateFormat");
                    storePreviousDateRange($(input).val(), dateFormat);
                    beforeShow.apply(myDateRangeTarget, arguments);
                };

                options.beforeShowDay = function (date) {
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

                options.onSelect = function (dateText, inst) {
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
                            if (options.useHiddenAltFields) {
                                var myToField = myDateRangeTarget.attr("data-to-field");
                                var myFromField = myDateRangeTarget.attr("data-from-field");
                                $("#" + myFromField).val(dateRange.start);
                                $("#" + myToField).val(dateRange.end);
                            }
                        }
                    }
                    onSelect.apply(myDateRangeTarget, arguments);
                };

                options.onClose = function (dateText, inst) {
                    inst.rangeStart = null;
                    inst.inline = false;
                    onClose.apply(myDateRangeTarget, arguments);
                };

                return this.each(function () {
                    if (myDateRangeTarget.is("input")) {
                        myDateRangeTarget.datepicker(options);
                    }
                    // myDateRangeTarget.wrap("<div class=\"dateRangeWrapper\"></div>");
                });
            };
        }(jQuery));

        //AFTER CLICKING THE DATE RANGE ICON.
        //This code will take the values and show the data for the selected date range

        $("#dateRange_icon").click(function () {

            $('#delivery_log_tableBody').empty(); //emptying before appending data

            console.log("Date range icon Clicked!");

            //taking the value from the input fields
            let startDate = $("#txtDateFrom").val();
            let endDate = $("#txtDateTo").val();

            console.log("startDate: " + startDate);
            console.log("endDate: " + endDate);

            // Returns an array of dates between the two dates
            var getDates = function (startDate, endDate) {
                var dates = [],
                    currentDate = startDate,
                    addDays = function (days) {
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
            dates.forEach(function (date) {
                let dd = date.getDate();
                let mm = date.getMonth() + 1;
                let yyyy = date.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd
                }

                if (mm < 10) {
                    mm = '0' + mm
                }

                let finalDate = yyyy + '-' + mm + '-' + dd;
                console.log(finalDate);

                //Now take the dates and search for them in the datebase
                //search in database
                for (let uniqueKey in fetchedData_deliveryLog) {

                    let issueDate = fetchedData_deliveryLog[uniqueKey]['issueDate'];
                    let tableToAppendData = $("#delivery_log_tableBody");

                    if (issueDate == finalDate) {
                        console.log("Date matched!! " + issueDate);

                        //loop through and parse the data then create TR in the table with this data
                        appendItemsIntoTable(uniqueKey, fetchedData_deliveryLog, tableToAppendData);
                    }
                }
            });
        });

        //EXPORT TABLE TO EXCEL FILE

        $("#exportToExcel_deliveryLog").click(function () {

            $("#exportToExcel_deliveryLog").css('color', 'white');

            //creating a workbook from the table
            var wb = XLSX.utils.table_to_book(document.getElementById('deliveryLog_table'), { sheet: "Sheet JS" });
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
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'Delivery Log.xlsx');
        });

        $(document).ready(function () {
            $("#txtDateRange").dateRangePicker({
                showOn: "focus",
                rangeSeparator: " to ",
                dateFormat: "mm-dd-yy",
                useHiddenAltFields: true,
                constrainInput: true
            });
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

