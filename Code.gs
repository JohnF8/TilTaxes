//TODO: JavaDocs style for the start of the code

function onEdit(){

  var transactionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions");
  populateSummarySheet(transactionSheet);
  
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    ss.setActiveSheet(ss.getSheetByName("Transactions"));
   
}

function defaultPaidField() {
  return "NO";
}


function addTransaction(e){
  addTransactionToSheet(e.values);
}

function addTransactionToSheet(eventValues){
  //Example: [6/8/2020 20:06:24, John, Aaron, 12, memes]
  var mySS = SpreadsheetApp.getActiveSpreadsheet();
  var transactionsSheet = mySS.setActiveSheet(mySS.getSheetByName("Transactions"));
  
  var curRange = transactionsSheet.getRange('A1:F');
  Logger.log("Range: ", curRange.getDataRegion().getA1Notation());
  transactionsSheet.setActiveRange(curRange);
 
 
 var splitPayer = eventValues[2].split(", ");
 Logger.log(splitPayer);
 
 for(var x=0; x<splitPayer.length; x++){
    transactionValues = curRange.getValues();
    var lastRow = getEmptyRow(transactionValues);
    transactionValues[lastRow][0] = eventValues[0];
    transactionValues[lastRow][1] = eventValues[1];
    transactionValues[lastRow][2] = splitPayer[x];
    transactionValues[lastRow][3] = eventValues[3];
    transactionValues[lastRow][4] = eventValues[4];
    transactionValues[lastRow][5] = defaultPaidField();
  
    curRange.setValues(transactionValues);
    populateSummarySheet(transactionsSheet);
  }
}

function populateSummarySheet(transactionsSheet){
  Logger.log("Starting to populate the sheet");
  
  var listPpl = getPeopleFromSheet();
  
  // Iterate through all the transactions and calculate the summary of charges
  var transactions = new Array(listPpl.length);
  
  //Create a 2D array
  for(var i=0;i<transactions.length;i++){
    transactions[i] = new Array(listPpl.length);
  }
  
  for(var i=0;i<transactions.length;i++){
    for(var j=0;j<transactions.length;j++){
      transactions[i][j]=0;
    }
  }
  
  for(var i=2;i<transactionsSheet.getLastRow()+1;i++){
    var values = transactionsSheet.getSheetValues(i, 1, 1, 6);
    Logger.log(values);
    if(values[0][0] === ""){
      break;
    }
    
    // Some people being billed consist of multiple people
    
    

     if(values[0][5] === "NO" || values[0][5] == "no"){
       transactions[getIndexOfPerson(values[0][1], listPpl)][getIndexOfPerson(values[0][2], listPpl)] = transactions[getIndexOfPerson(values[0][1], listPpl)][getIndexOfPerson(values[0][2], listPpl)] + values[0][3];
     }
    Logger.log("Transactions arr: ", transactions);
    
    
  }
  // Write the contents to the spreadsheet
  var summarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary");
  summarySheet.getRange(2,2,transactions.length, transactions.length).setValues(transactions);
  

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

function getPeopleFromSheet(){
  var mySS = SpreadsheetApp.getActiveSpreadsheet();
  var pplSheet = SpreadsheetApp.setActiveSheet(mySS.getSheetByName("People"));
  
  var pplRange = pplSheet.getRange("A1:A");
  var names = pplRange.getValues();
  
  var people = new Array();
  var i=0;
  
  //Get an array of just the people in the range
  for(i=0;i<names.length;i++){
    if(names[i] != ""){
      var nameStr = names[i].toString();
      Logger.log("New Name: ", nameStr);
      people.push(nameStr);
    }
  }
  Logger.log("The names of the people are: ", people);
  return people;
}

function getIndexOfPerson(personName, arr){
  var i=0;
  for(i=0;i<arr.length;i++){
    if(arr[i] === personName){
      return i;
    }
  }
  Logger.log("The missing person is: ", personName);
  return -1;
}







