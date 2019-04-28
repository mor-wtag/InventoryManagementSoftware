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

        let fetchedData_inventory = snapshot.val();

        ////FILTERING FOR DESTINATION
        //STATIC DROPDOWN added by fetching data from the Destination database when the page reloads 

        //fetch the data from destination database

        let response1 = database.ref('databases/Destination_database').once('value');

        response1.then(function (snapshot) {

            let fetchedData_destination = snapshot.val();

            //delete the existing dropdown at the start of a keypress to avoid multiple entries on every keypress and so that the dropdown is freshly populated on every keypress
            $("#destination_dropdown").empty();

            //append html code to insert dynamic dropdown select function
            $("#destination").append(`<datalist id='destination_dropdown'></datalist>`);

            //loop through and parse the data to check if the item name is present in the database
            for (let uniqueKey in fetchedData_destination) {

                let filtered_destination = fetchedData_destination[uniqueKey]['destination'];

                //converting to string format 
                let string_destination_filtered = filtered_destination.toString();

                //checked if its the first item, now add the option values
                $("#destination_dropdown").append(`<option id='${string_destination_filtered}'>${string_destination_filtered}</option>`);
            }
        });

        //////FILTERING FOR UOM
        //STATIC DROPDOWN added by fetching data from the uom_database when the page reloads 

        //fetch the data from UOM database

        let response2 = database.ref('databases/uom_database').once('value');

        response2.then(function (snapshot) {

            let fetchedData_uom = snapshot.val();

            //delete the existing dropdown at the start of a keypress to avoid multiple entries on every keypress and so that the dropdown is freshly populated on every keypress
            $("#uom_dropdown").empty();

            //append html code to insert dynamic dropdown select function
            $("#uom").append(`<datalist id='uom_dropdown'></datalist>`);

            //loop through and parse the data to check if the item name is present in the database
            for (let uniqueKey in fetchedData_uom) {

                let filtered_uom = fetchedData_uom[uniqueKey]['uom'];

                //converting to string format 
                let string_uom_filtered = filtered_uom.toString();

                //checked if its the first item, now add the option values
                $("#uom_dropdown").append(`<option id='${string_uom_filtered}'>${string_uom_filtered}</option>`);
            }
        });

        //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN OUR PAGE

        //READING FROM FIREBASE DATABASE
        let response3 = database.ref('databases/delivery_log').once('value');
        
        response3.then(function (snapshot) {

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

                //EDIT ICON CLICKED
                $(`#edit_data_icon_${reversed_uniqueKey}`).click(function () {

                    console.log("CLICKED EDIT ICON WITH UNIQUE KEY: " + reversed_uniqueKey);

                    let itemName = fetchedData_deliveryLog[reversed_uniqueKey]['itemName'];
                    let quantity = fetchedData_deliveryLog[reversed_uniqueKey]['quantity'];

                    //Alert and Ask the user to confirm if they want to delete the data from the table
                    let edit_row = confirm(`Are you sure you want to edit the item ${itemName}?`);

                    //if the user clicks ok
                    if (edit_row == true) {

                        //Make the form appear so that the user can edit it
                        $("#deliveryLogForm_wrapper").css('display', 'inline-block');
                        //redirect the user to the top of the page
                        window.location.href = "#deliveryLogForm_wrapper";

                        //complete the fields with the pre fetched previous data that is to be edited
                        let itemCode_deliveryLog_prev = $("#itemCode").val(fetchedData_deliveryLog[reversed_uniqueKey]['itemCode']);
                        let itemName_deliveryLog_prev = $("#itemName").val(fetchedData_deliveryLog[reversed_uniqueKey]['itemName']);
                        let uom_deliveryLog_prev = $("#uom").val(fetchedData_deliveryLog[reversed_uniqueKey]['uom']);
                        let quantity_deliveryLog_prev = $("#quantity").val(fetchedData_deliveryLog[reversed_uniqueKey]['quantity']);
                        let destination_deliveryLog_prev = $("#destination").val(fetchedData_deliveryLog[reversed_uniqueKey]['destination']);
                        let issueDate_deliveryLog_prev = $("#issueDate").val(fetchedData_deliveryLog[reversed_uniqueKey]['issueDate']);

                        let quantity_deliveryLog_prev_value = quantity_deliveryLog_prev.val();
                        console.log("quantity_deliveryLog_prev= " + quantity_deliveryLog_prev_value); //noty writing .val() will not show the value of each of the variables

                        //SUBMIT ENTRY LOG FORM
                        $('#submit_deliveryLog').click(function (event) {

                            event.preventDefault();

                            //On submission of the form, take the values of the fields in order to update them
                            let itemCode_deliveryLog = $("#itemCode").val();
                            let itemName_deliveryLog = $("#itemName").val();
                            let uom_deliveryLog = $("#uom").val();
                            let quantity_deliveryLog = $("#quantity").val();
                            let destination_deliveryLog = $("#destination").val();
                            let issueDate_deliveryLog = $("#issueDate").val();

                            console.log("quantity_deliveryLog_new= " + quantity_deliveryLog);

                            //Check if quantity is the same as before. If not, need to Update Inventory
                            if (parseInt(quantity_deliveryLog) != parseInt(quantity_deliveryLog_prev_value)) {

                                console.log("The quantities are not equal!");
                                //update inventory
                                //this code is a complicated!!
                                //since we want to call the update_inventory_database function, we have to adjust the value of quantity before sending it as an argument so that it changes in the inventoru database accordingly
                                let quantity_sendingTo_inventoryFunction = parseInt(quantity_deliveryLog_prev_value) - (parseInt(quantity_deliveryLog));

                                console.log("quantity_sendingTo_inventoryFunction= " + quantity_sendingTo_inventoryFunction);

                                //call the function to update the inventory
                                update_inventory_database(itemCode_deliveryLog, quantity_sendingTo_inventoryFunction);

                            }
                            //Now to update the Entry Log
                            let update_data_deliveryLog =
                            {
                                'itemCode': itemCode_deliveryLog,
                                'itemName': itemName_deliveryLog,
                                'uom': uom_deliveryLog,
                                'quantity': quantity_deliveryLog,
                                'destination': destination_deliveryLog,
                                'issueDate': issueDate_deliveryLog
                            }

                            let update_deliveryLog = database.ref('databases/delivery_log/' + reversed_uniqueKey).update(update_data_deliveryLog).then(function () {
                                alert("Item successfully updated");
                                window.location.reload();
                            });
                        });
                    }
                    //if user clicks cancel
                    else {
                        return false;
                    }
                });

                //DELETE
                $(`#delete_data_icon_${reversed_uniqueKey}`).click(function () {

                    console.log("CLICKED DELETE ICON WITH UNIQUE KEY: " + reversed_uniqueKey);

                    let itemName = fetchedData_deliveryLog[reversed_uniqueKey]['itemName'];
                    let quantity = fetchedData_deliveryLog[reversed_uniqueKey]['quantity'];

                    //Alert and Ask the user to confirm if they want to delete the data from the table
                    let delete_row = confirm(`Are you sure you want to delete item ${itemName} with quantity ${quantity} from the table?`);

                    //if the user clicks ok
                    if (delete_row == true) {

                        //remove bode with unique key from ENTRY_LOG Database
                        database.ref('databases/delivery_log/' + reversed_uniqueKey).remove().then(function () {

                            //update inventory database
                            //have to add the deleted item with the same quantity
                            update_inventory_database(itemName, quantity).then(function(){
                                window.location.reload();
                            });
                        });
                    }
                    //if user clicks cancel
                    else {
                        return false;
                    }
                });


                //function to update inventory
                function update_inventory_database(itemCode, quantity) {

                    console.log("...Deleted row, now updating inventory...");
                    console.log("itemCode: " + itemCode);
                    console.log("quantity: " + quantity);

                        for (let uniqueKey in fetchedData_inventory) {

                            let itemCode_inventory = fetchedData_inventory[uniqueKey]['itemCode'];
                            let quantity_inventory = fetchedData_inventory[uniqueKey]['quantity'];

                            //if item names match
                            if (itemCode_inventory == itemCode) {

                                console.log("ITEM NAMES MATCHED!");

                                //update quantity by adding back the subtracted quantity
                                let updatedQuantity = parseInt(quantity_inventory) + ( parseInt(quantity) );

                                let update_inventory =
                                {
                                    'quantity': updatedQuantity
                                }
                                //now update inventory database
                                let promise = database.ref('databases/InventoryDatabase/' + uniqueKey).update(update_inventory).then(function () {
                                });
                                return promise;
                            }
                        }
                   

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
    });
}

