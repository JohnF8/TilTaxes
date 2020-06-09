function defaultPaidField() {
  return "NO";
}

function getPeopleArr(){
  var mySS = SpreadsheetApp.getActiveSpreadsheet();
  var pplSheet = SpreadsheetApp.setActiveSheet(mySS.getSheetByName("People"));
  
  var pplRange = pplSheet.getRange("B2:B20");
  var names = pplRange.getValues();
  Logger.log("The names of the people are: ", names);
  
  Logger.log("First person: ", names[1][0]);
}

function addTransaction(e){
  addTransactionToSheet(e.values);
}

function addTransactionToSheet(eventValues){
  //Example: [6/8/2020 20:06:24, John, Aaron, 1242, memes]
  var mySS = SpreadsheetApp.getActiveSpreadsheet();
  var transactionsSheet = mySS.setActiveSheet(mySS.getSheetByName("Transactions"));
  
  var curRange = transactionsSheet.getRange('A1:F');
  Logger.log("Range: ", curRange.getDataRegion().getA1Notation());
  transactionsSheet.setActiveRange(curRange);
  
  transactionValues = curRange.getValues();
  var lastRow = getEmptyRow(transactionValues);
 
  
  transactionValues[lastRow+1][0] = eventValues[0];
  transactionValues[lastRow+1][1] = eventValues[1];
  transactionValues[lastRow+1][2] = eventValues[2];
  transactionValues[lastRow+1][3] = eventValues[3];
  transactionValues[lastRow+1][4] = eventValues[4];
  transactionValues[lastRow+1][5] = defaultPaidField();
  

  
  curRange.setValues(transactionValues);
}

function getEmptyRow(values){
  var i = 0;
  for(i=0;i<values.length;i++){
    if(values[i][0] === ""){
      Logger.log("The last value is: ", i);
      return i;
    }
  }
  return -1;
}