/**
 * This project enables the ability to track money within an apartment or living community among roomates. 
 * The following code interacts with a Google Form to take the transaction data, display it in a list, and update the amount that each person owes to one another. 
 *
 * @fileOverview Backend code to display information on a Google Sheet. 
 * @author John Ference
 * @version 1.0
 */
 
/**
 * When something on the Sheet was changed, update the summary list of money owed. 
 */
function onEdit(){
  var transactionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions");
  populateSummarySheet(transactionSheet);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setActiveSheet(ss.getSheetByName("Transactions"));
}


/**
 * Defaults the paid field of each transaction in "Transactions" as not paid. 
 */
function defaultPaidField() {
  return "NO";
}


/**
 * Trigger for when a Google Form is submitted. 
 */
function addTransaction(e){
  addTransactionToSheet(e.values);
}


/**
 * Takes the data inputted from Google Form and adds it to the Transactions sheet
 */
function addTransactionToSheet(eventValues){
  var mySS = SpreadsheetApp.getActiveSpreadsheet();
  var transactionsSheet = mySS.setActiveSheet(mySS.getSheetByName("Transactions"));
  var curRange = transactionsSheet.getRange('A1:F'); // Transactions occupy columns A-F. 
  transactionsSheet.setActiveRange(curRange);
 
  var splitPayer = eventValues[2].split(", "); // Split all the people being billed and them individually to the list. 
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
    populateSummarySheet(transactionsSheet); //Add the data to the sheet
  }
}


/**
 * Calculates all the transactions that have not been paid and shows them in a summary table
 */
function populateSummarySheet(transactionsSheet){
  var listPpl = getPeopleFromSheet();
  
  // Iterate through all the transactions and calculate the summary of charges
  var transactions = new Array(listPpl.length);
  
  //Create a 2D array of biller to person being billed
  for(var i=0;i<transactions.length;i++){
    transactions[i] = new Array(listPpl.length);
  }
  //Fill the 2D array with 0s, because JS does not do this automatically.
  for(var i=0;i<transactions.length;i++){
    for(var j=0;j<transactions.length;j++){
      transactions[i][j]=0;
    }
  }
  
  // Find where there are no more transactions
  for(var i=2;i<transactionsSheet.getLastRow()+1;i++){
    var values = transactionsSheet.getSheetValues(i, 1, 1, 6);
    if(values[0][0] === ""){
      break;
    }
   
   //Calculate all the transactions that are not paid yet. 
   if(values[0][5] === "NO" || values[0][5] == "no"){
     transactions[getIndexOfPerson(values[0][1], listPpl)][getIndexOfPerson(values[0][2], listPpl)] = transactions[getIndexOfPerson(values[0][1], listPpl)][getIndexOfPerson(values[0][2], listPpl)] + values[0][3];
   }
  }
  
  // Write the contents to the spreadsheet
  var summarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Summary");
  summarySheet.getRange(2,2,transactions.length, transactions.length).setValues(transactions);
}


/**
 * Defaults the paid field of each transaction in "Transactions" as not paid. 
 */
function getEmptyRow(values){
  var i = 0;
  for(i=0;i<values.length;i++){
    if(values[i][0] === ""){
      return i;
    }
  }
  return -1;
}


/**
 * Reads all the people in your apartment from the People sheet
 */
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


/**
 * From the array formed from the People sheet, get the index of the person in that list.
 */
function getIndexOfPerson(personName, arr){
  var i=0;
  for(i=0;i<arr.length;i++){
    if(arr[i] === personName){
      return i;
    }
  }
  Logger.log("Person not found: ", personName);
  return -1;
}







