
//this file will work with index.html

function initialLoad() {

    //Initializing variables after loading page

    let items_with_zero_quantity = 0;
    let items_with_lessThan5_quantity = 0;
    let total_quantity = 0;
    let total_quantity_delivered = 0;
    let quantity_by_destination_array=[];
    let destination_array = [];
    let quantity_deliveryDatabase = [];
    let itemName_deliveryDatabase = [];

    //FETCH DATA FROM THE DATABASE AND INITIALIZE EVERYTHING IN PAGE

    //READING FROM FIREBASE DATABASE
    database.ref('databases/InventoryDatabase').once('value').then(function (snapshot) {

        console.log("Got data from the inventory!");

        let fetchedData_inventory = snapshot.val();
        console.log(fetchedData_inventory);

        database.ref('databases/DeliveryDatabase').once('value').then(function (snapshot) {

            console.log("Got data from the delivery database!");

            let fetchedData_delivery = snapshot.val();
            console.log(fetchedData_delivery);

            //---FIRST & SECOND TILE---
            //ITEMS HAVING ZERO AND LTE5 QUANTITY

            //This code here is to check how many items have zero quantity in inventory database and pushing the number into the first tile
            for (let uniqueKey in fetchedData_inventory) {

                //Initialize the quantity only so that we can only check the ones who have zero quantity
                let quantity = fetchedData_inventory[uniqueKey]['quantity'];

                //this is for the THIRD tile
                //to keep track of total number of quantity
                total_quantity = parseInt(total_quantity) + parseInt(quantity);

                if (quantity == 0) {
                    console.log("Found an item with zero quantity!");

                    //item increment
                    items_with_zero_quantity += 1;

                    let tableToAppendData = $("#zero_quantity_table_tableBody"); //getting the table in which we will append the data

                    //calling function to append to table   
                    appendItemsIntoTable(uniqueKey, fetchedData_inventory, tableToAppendData);
                }

                else if (quantity <= 5) {

                    console.log("Found an item with less than 5 quantities!");

                    //item increment
                    items_with_lessThan5_quantity += 1;

                    let tableToAppendData = $("#lessThan5_quantity_table_tableBody");

                    //calling function to append to table   
                    appendItemsIntoTable(uniqueKey, fetchedData_inventory, tableToAppendData);

                }
            }

            console.log("total_quantity: " + total_quantity);

            function appendItemsIntoTable(uniqueKey, database_table, tableToAppendData) {

                console.log("Got into the function to append items into the table");
                //loop through and parse the data then create TR in the table with this data
                let itemCode = database_table[uniqueKey]['itemCode'];
                let itemName = database_table[uniqueKey]['itemName'];
                let uom = database_table[uniqueKey]['uom'];
                let quantity = database_table[uniqueKey]['quantity'];

                //append in the table that's not being displayed
                // appending elements into the databaseTable
                $(tableToAppendData).append(/*html*/`
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
                </tr>
                `);
            }

            //---FIRST TILE---
            $('#zero_quantity_data').attr('data-end', items_with_zero_quantity); //NOT WORKING
            //adding database value to the tile
            $("#zero_quantity_data").text(items_with_zero_quantity);

            //on clicking the tile, the dables below will become invisible, and the data table will become visible
            $('#zero_quantity_tile').click(function () {

                $('#lessThan5_quantity_table').css("display", "none");
                $('#index_delivery_table').css("display", "none");

                //making all tables invisible
                $('.index_mainContent_below_tiles').animate({
                    top: '30%'
                }, 200);

                //making the table visible
                $('#zero_quantity_table').toggle();
            });

            //---SECOND TILE---
            //ITEMS HAVING LESS THAN OR EQUAL TO 5 QUANTITY
            $('#lessThan5_quantity_data').attr('data-end', items_with_lessThan5_quantity); //NOT WORKING
            //adding database value to the tile
            $("#lessThan5_quantity_data").text(items_with_lessThan5_quantity);
            //onclicking the tile, the dables below will become invisible, and the data table will become visible
            $('#lessThan5_quantity_tile').click(function () {

                $('#zero_quantity_table').css("display", "none");
                $('#index_delivery_table').css("display", "none");

                //making all tables invisible
                $('.index_mainContent_below_tiles').animate({
                    top: '30%'
                }, 200);

                //making the table visible
                $('#lessThan5_quantity_table').toggle();
            });

            ////---THIRD TILE---
            //TOTAL NUMBER OF ITEMS IN THE INVENTORY
            $('#total_quantity_data').attr('data-end', total_quantity);
            //adding database value to the tile
            $("#total_quantity_data").text(total_quantity);
            //onclicking the tile, the dables below will become invisible, and the data table will become visible
            $('#total_quantity_tile').click(function () {
                window.location.href = "./inventory.html";
            });

            ////---FOURTH TILE---
            //ITEMS DELIVERED
            for (let uniqueKey in fetchedData_delivery) {
                let quantity_delivered = fetchedData_delivery[uniqueKey]['quantity'];

                //adding each quantity
                total_quantity_delivered += parseInt(quantity_delivered);

                let tableToAppendData = $("#index_delivery_tableBody"); //getting the table in which we will append the data

                //calling function to append to table   
                appendItemsIntoTable(uniqueKey, fetchedData_delivery, tableToAppendData);
            }

            console.log("total_quantity_delivered: " + total_quantity_delivered);
            //trying to change the data end value
            $('#total_quantity_delivered').attr('data-end', total_quantity_delivered);
            //adding database value to the tile
            $("#total_quantity_delivered").text(total_quantity_delivered);
            //onclicking the tile, the dables below will become invisible, and the data table will become visible
            $('#items_delivered_tile').click(function () {

                $('#zero_quantity_table').css("display", "none");
                $('#lessThan5_quantity_table').css("display", "none");

                //making all tables invisible
                $('.index_mainContent_below_tiles').animate({
                    top: '30%'
                }, 200);

                //making the table visible
                $('#index_delivery_table').toggle();
            });

            //---BAR CHART---
            //DESTINATION WISE ITEM CONSUMPTION
            //Fetching data from DESTINATION DATABASE
            database.ref('databases/Destination_database').once('value').then(function (snapshot) {

                console.log("Got data from the Destination_database!");
        
                let fetchedData_destination = snapshot.val();
                console.log(fetchedData_destination);
                destination_index=0;
                //storing the destination and quantity into two arrays 
                for (let uniqueKey in fetchedData_destination) {
                    
                    let destination_destination = fetchedData_destination[uniqueKey]['destination'];
                    let quantity_destination = fetchedData_destination[uniqueKey]['quantity'];

                    quantity_by_destination_array[destination_index] = quantity_destination;
                    destination_array[destination_index] = destination_destination;
                    destination_index++;
                }

                //SORTING ARRAYS
                //finding out the destinations with the most quantities
                //sorting the quantities keeping the destination recorded

                //1) combine the arrays:
                var list_quantityByDestination = [];
                for (var j = 0; j < quantity_by_destination_array.length ; j++) 
                    list_quantityByDestination.push({'quantity': quantity_by_destination_array[j], 'destination': destination_array[j]});

                //2) sort:
                list_quantityByDestination.sort(function(a, b) {
                    return ((a.quantity > b.quantity) ? -1 : ((a.quantity == b.quantity) ? 0 : 1));
                });
                console.log(list_quantityByDestination);
                console.log(list_quantityByDestination[0].quantity);

                //BAR CHART CODE FROM CHART.JS
                var ctx = document.getElementById('BarChart').getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: [`${list_quantityByDestination[0].destination}`, `${list_quantityByDestination[1].destination}`, `${list_quantityByDestination[2].destination}`, `${list_quantityByDestination[3].destination}`, `${list_quantityByDestination[4].destination}`],
                        datasets: [{
                            label: 'Item consumption',
                            data: [`${list_quantityByDestination[0].quantity}`, `${list_quantityByDestination[1].quantity}`, `${list_quantityByDestination[2].quantity}`, `${list_quantityByDestination[3].quantity}`, `${list_quantityByDestination[4].quantity}`],
                            backgroundColor: [
                                '#cc2424',
                                '#0f7ca9',
                                '#8df08c',
                                '#ff623f',
                                '#731077'
                            ],
                            borderColor: [
                                '#980f0f',
                                '#085a7b',
                                '#45a044',
                                '#de4725',
                                '#450548'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                },
                                gridLines: {
                                    display: false,
                                    color: "#303641c9"
                                },
                            }],

                            xAxes: [{
                                gridLines: {
                                    display: false,
                                    color: "#303641c9"
                                },
                                categoryPercentage: 0.9,
                                barPercentage: 0.9
                            }]
                        }
                    }
                });

                //---LINE CHART---
                //MOST FREQUENTLY USED ITEMS
                //This code will take the most delivered item from the database and then give data of what items have been delievered the most
                let delivery_index=0;
                for (let uniqueKey in fetchedData_delivery) {
                    let quantity_delivered = fetchedData_delivery[uniqueKey]['quantity'];
                    let item_delivered = fetchedData_delivery[uniqueKey]['itemName'];

                    //save the quantity and item name into two arrays
                    quantity_deliveryDatabase[delivery_index] = quantity_delivered;
                    itemName_deliveryDatabase[delivery_index] = item_delivered;
                    delivery_index++;
                }
                //SORTING array in decending order

                //finding out the destinations with the most quantities
                //sorting the quantities keeping the destination recorded

                //1) combine the arrays:
                var list_quantityByDelivery = [];
                for (var j = 0; j < quantity_by_destination_array.length ; j++) 
                    list_quantityByDelivery.push({'quantity': quantity_deliveryDatabase[j], 'itemName': itemName_deliveryDatabase[j]});

                //2) sort:
                list_quantityByDelivery.sort(function(a, b) {
                    return ((a.quantity > b.quantity) ? -1 : ((a.quantity == b.quantity) ? 0 : 1));
                });
                console.log(list_quantityByDelivery);

                //LINE CHART CODE FROM CHART.JS
                var ctxy = document.getElementById('LineChart').getContext('2d');
                var myCharts = new Chart(ctxy, {
                    type: 'line',
                    data: {
                        labels: [`${list_quantityByDelivery[0].itemName}`, `${list_quantityByDelivery[1].itemName}`, `${list_quantityByDelivery[2].itemName}`, `${list_quantityByDelivery[3].itemName}`, `${list_quantityByDelivery[4].itemName}`],
                        datasets: [{
                            label: 'Frequently used items',
                            fillColor:'blue',
                            data: [`${list_quantityByDelivery[0].quantity}`, `${list_quantityByDelivery[1].quantity}`, `${list_quantityByDelivery[2].quantity}`, `${list_quantityByDelivery[3].quantity}`, `${list_quantityByDelivery[4].quantity}`],
                            backgroundColor: '#5af5e5bd',
                            // borderColor: '#0f7ca9',
                            pointBackgroundColor: [
                                '#cc2424',
                                '#0f7ca9',
                                '#8df08c',
                                '#ff623f',
                                '#731077'
                            ],
                            // pointBorderColor: ''
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                },
                                gridLines: {
                                    display: false,
                                    color: "#303641c9"
                                },
                            }],

                            xAxes: [{
                                gridLines: {
                                    display: false,
                                    color: "#303641c9"
                                },
                                categoryPercentage: 0.9,
                                barPercentage: 0.9
                            }]
                        }
                    }
                });
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
