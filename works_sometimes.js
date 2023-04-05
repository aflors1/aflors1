// Update stock of "Items" after a new "Order" is placed 
(function() {
  'use strict';
    kintone.events.on('app.record.create.submit', function(event) {
// Get values from new order in "Orders"
  var record = event.record;
  var type = record.order_type.value;  
  var qty = record.qty.value; 
  var itemValue = record.item_name.value; 

// Define variables to look up the item ordered record ID from "Items"
const appId = 6; 
const fieldCode = 'item'; 
const fieldValue = itemValue; 
const query = `${fieldCode} = "${fieldValue}"`;

// Define the API parameters
const params = {
  app: appId,
  query: query,
  fields: ['$id']
};
// Make a call to the Kintone API to retrieve the record ID
kintone.api('/k/v1/records', 'GET', params, function(resp) {
    var recordId; 
  if (resp.records.length > 0) {
    recordId = resp.records[0].$id.value;
    alert('Record ID ' + recordId); 
  } else {
    console.log('No records found');
  }

// Get current stock of the item from "Items"
var stock = "stock"; 
var stockBody = { 
  'app': 6,
  'id': recordId
}; 

// Make a call to Kintone API to retrive current stock 
kintone.api(kintone.api.url('/k/v1/record', true), "GET", stockBody, function(resp) {
        var currStock = resp.record[stock].value;
        var newStock; 
        alert('Current stock: ' + currStock); 
      // If Purchase, stock is added
        if (type === "Purchase") { 
          newStock = Number(currStock) + Number(qty);
          alert('New stock ' + newStock); 
      // If Sale, stock is subtracted 
        } else {
          newStock = Number(currStock) - Number(qty);
          alert('New stock ' + newStock); 
        } 
        // Set values for new stock that will be used in API
          var updateStock = {
            stock: { value: newStock },
          };
          var body = {
            'app': 6,
            'id': recordId, 
            'record': updateStock
          };

              kintone.api(kintone.api.url('/k/v1/record',true), 'PUT', body, function(resp){
              // success
              console.log(resp);
              }, function(error) {
              // error
              console.log(error);
              });
          }); 
      });
    });
})();