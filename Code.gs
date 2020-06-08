arr = ["john", "danny", "sam"];
letters = "abcdefghijklmnopqrstuvwxyz";

//Biller should start on A4 and contine based on the number of people
  


function onOpen(){
  Logger.log("Starting it up");
  //Add menu for billing
  var ui = SpreadsheetApp.getUi().createMenu('Bill').addItem('Bill one person', 'billOne').addItem('Bill multiple people', 'billMultiple').addToUi();
}


function billOne(){
  Logger.log("Billing one person");
  var html = HtmlService.createHtmlOutputFromFile('BillPage');
  SpreadsheetApp.getUi().showModalDialog(html, "Bill one person");
  Logger.log("should be done?");
} 


function sendBillData(biller,p1Val, p2Val, p3Val, amount){
  Logger.log("The biller is: ", biller);
  Logger.log("The amount is: ", amount);
  
  var rowNum = getRowFromArr(biller) + 4;
  
  if(p1Val == 1){
      var cell = "B"+rowNum;
      setValue(cell, getValue(cell)+amount);
  }
  
   if(p2Val == 1){
      var cell = "C"+rowNum;
      setValue(cell, getValue(cell)+amount);
  }
  
   if(p3Val == 1){
      var cell = "D"+rowNum;
      setValue(cell, getValue(cell)+amount);
  }
    
}
 
 
function getRowFromArr(biller){
  var i =0;
   for(i=0; i < arr.length; i++){
     if(biller === arr[i]){
       return i;
     }
   }
 }
 
 function getValue(cell) {
  return SpreadsheetApp.getActiveSheet().getRange(cell).getValue();
}

function setValue(cell, value) {
  return SpreadsheetApp.getActiveSheet().getRange(cell).setValue(value);
}