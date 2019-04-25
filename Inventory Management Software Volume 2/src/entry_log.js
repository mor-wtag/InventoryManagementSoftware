//this file will work with entry_log.html


function initialLoad(){

    //initialize variables after loading page

    let today;
    let uniqueKey_Array=[];

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

        let fetchedData_entryLog = snapshot.val();

        //Code in order to show the last entry first (LAST IN FIRST OUT)

        //loop through unique keys and create an array in order to view get all the unique keys
        let uniqueKeyArray_index=0;
        for (let uniqueKey in fetchedData_entryLog){
            uniqueKey_Array[uniqueKeyArray_index] =  uniqueKey;
            uniqueKeyArray_index++;
        }

        console.log('uniqueKey_Array: '+uniqueKey_Array);

        //APPEND ITEMS TO TABLE FUNCTION
        function appendItemsIntoTable(uniqueKey, fetchedData, tableToAppendData){

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

        //from the unique key array, reverse it and set each variable so that the fetched data from that unique key can be found

        for (let reversed_uniqueKey_index=uniqueKey_Array.length-1; reversed_uniqueKey_index>=0; reversed_uniqueKey_index--){
            
            let reversed_uniqueKey = uniqueKey_Array[reversed_uniqueKey_index];
            let tableToAppendData = $("#entry_log_tableBody");
            let fetchedData = fetchedData_entryLog;

            //calling function to append each item into the table
            appendItemsIntoTable(reversed_uniqueKey, fetchedData, tableToAppendData);

            //---EVENT LISTENER FOR CLICKING ON EDIT/ DELETE DATA ICON

            //DELETE
            $(`#delete_data_icon_${reversed_uniqueKey}`).click(function(){

                console.log("CLICKED DELETE ICON WITH UNIQUE KEY: "+reversed_uniqueKey);

                //Alert and Ask the user to confirm if they want to delete the data from the table
                let delete_row = confirm(`Are you sure you want to delete item ${itemName} with quantity ${quantity} issued on ${issueDate} for the table?`);

                //if the user clicks ok
                if (delete_row== true){

                    //remove bode with unique key from ENTRY_LOG Database
                    database.ref('databases/entry_log/'+reversed_uniqueKey).remove().then(function(){

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

                            //update quantity by subtracting back the added quantity
                            let updatedQuantity = parseInt(quantity_inventory) - parseInt(quantity);
                            
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

        $("#search_entryLog").on("keydown" && "keyup", function(){

            //on erasing the search field, the table needs to repopulate again with all the inventory items

            console.log("Got inside the search function");

            $('#entry_log_tableBody').empty();  //emptying the table so that sorted values can be appended

             //get item name from the input field
            let search_entryLog = $("#search_entryLog").val();

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

                let user_name = user_email.split("@"); //split the array so that you can display the name before the @ domain

                //loop through and parse the data then create TR in the table with this data
                let string_itemName_filtered = itemName.toString();

                let string_searched_itemName = search_entryLog.toString().toLowerCase();

                let string_itemName_filtered_lowercase = string_itemName_filtered.toLowerCase();// lowercase version of the filtered string item so that it can be compared

                //look for partial/complete match of the item Name searched string and the item name found in database string

                if (string_itemName_filtered_lowercase.includes(string_searched_itemName)){

                    console.log('Found the item code you were looking for: '+ string_itemName_filtered); //adding the item that's not converted to lowercase so that it can be used to get the correct information from the database

                    // appending elements into the databaseTable
                    $('#entry_log_tableBody').append(/*html*/`
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

            $('#entry_log_tableBody').empty(); //emptying before appending data

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
                        let unitRate = fetchedData[uniqueKey]['unitRate'];
                        let totalAmount = fetchedData[uniqueKey]['totalAmount'];
                        let mainContract = fetchedData[uniqueKey]['mainContract'];
                        let mainVendor = fetchedData[uniqueKey]['mainVendor'];
                        let novatedContract = fetchedData[uniqueKey]['novatedContract'];
                        let novatedVendor = fetchedData[uniqueKey]['novatedVendor'];
                        let PRnum = fetchedData[uniqueKey]['PRnum'];
                        let POnum = fetchedData[uniqueKey]['POnum'];
                        let delChalNum = fetchedData[uniqueKey]['delChalNum'];
                        let user_email = fetchedData[uniqueKey]['user_email'];
                        let current_date = fetchedData[uniqueKey]['current_date'];


                        let user_name = user_email.split("@"); //split the array so that you can display the name before the @ domain


                        // appending elements into the databaseTable
                        $('#entry_log_tableBody').append(/*html*/`
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

        $("#exportToExcel_entryLog").click(function(){

            $("#exportToExcel_entryLog").css('color','white');

            //creating a workbook from the table
            var wb = XLSX.utils.table_to_book(document.getElementById('entryLog_table'), {sheet:"Sheet JS"});
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
                saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Entry Log.xlsx');
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

    //---LOGOUT---
    $("#logoutBtn").click(function(){

        //ask if sure they want to sign out
        
        let signOut = confirm("Are you sure you want to sign out?");

        if (signOut == true){

            //user clicked ok

            firebase.auth().signOut().then(function() {
                // Sign-out successful.
                //send back to the login page
                window.location.href = "./login.html";

            }).catch(function(error) {
              // An error happened.
              alert("error.code");
            });
        }
        else{
            //user clicked cancel
            //stay in the same page
            return false;
        }
        
    });
}
