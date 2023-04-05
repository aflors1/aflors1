// Update stock of "Items" after a new "Order" is placed 
(function() {
  'use strict';
    kintone.events.on('app.record.create.submit', function(event) {
// Get values from new order in "Orders"
  var record = event.record;
  var type = record.order_type.value;  
  var qty = record.qty.value; 
  var itemValue = record.item_name.value; 
  var stock = "stock";

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

// Make a call to Kintone API to retrive current stock 
return kintone.api(kintone.api.url('/k/v1/record', true), "GET",  { 
  'app': 6,
  'id': recordId
  },
  
  (function(resp) { 
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
      
  }).then(function(final) {
      kintone.api(kintone.api.url('/k/v1/record',true), 'PUT', {
          'app': 6,
          'id': recordId, 
          'record': {stock: { value: newStock }}
        }); 
          return resp; 
}).catch(function(error) { 
      console.log(error);
          return resp;
    })); 
    });
    }); 
})();
