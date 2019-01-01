function myFunction() {
  var now = new Date();
  var date = Utilities.formatDate(now, "GMT", "dd-MM-yy");

  var preMessage = "Today, " + date + ", you're on";
  var kitchenMessage = " kitchen. Remember, that means taking the bins out (including the recycling), cleaning all work-surfaces and the stovetop, and sweeping the floor. ";
  var htmlKitchen = "<b> kitchen</b> duty." +
    "<p>Remember, that means taking the bins out (including the recycling), cleaning all work-surfaces and the stovetop, and sweeping the floor.</p>" +
    "</body>";
  var bathroomMessage = " bathrooms. Remember, that means scrubbing the bath and sinks, binning any bathroom rubbish, cleaning surfaces and bleaching the toilets. ";
  var htmlBathroom = "<b> bathroom</b> duty." +
    "<p>Remember, that means scrubbing the bath and sinks, binning any bathroom rubbish, cleaning surfaces and bleaching the toilets.</p>" +
    "</body>";
  var loungeMessage = " living room. Remember, that means tidying up and sweeping the lounge, in addition to hoovering the communal carpets. ";
  var htmlLounge = "<b> living room</b> duty." +
    "<p>Remember, that means tidying up and sweeping the lounge, in addition to hoovering the communal carpets.</p>" +
    "</body>";
  var errorMessage = " unknown... spooky. The developer has been notified of this error. ";
  var htmlError = "<b>unknown</b>... spooky." +
    "<p>Reply to alert the developer to this error.</p>" +
    "</body>";
  var htmlPost = "<p>Thanks,</p>" +
    "<p><i>Super</i>AutoDink</p>";

  var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1QR_5JN8zZ4ds_cAqJKNp7mFCspo6N5S-NSnlm_GZn6c/edit#gid=0");

  var dunkChores = sheet.getRange("Memory!B2:B3").getDisplayValues();
  var chrisChores = sheet.getRange("Memory!C2:C3").getDisplayValues();
  var roanChores = sheet.getRange("Memory!D2:D3").getDisplayValues();

  Logger.log("1 D: " + dunkChores + " C: " + chrisChores + " R: " + roanChores);

  var tenantObj = {
    dunkObj: {},
    chrisObj: {},
    roanObj: {}
  };

  tenantObj.dunkObj = {
    name: "Dunk",
    chore: dunkChores[0],
    email: "dunkemail@gmail.com"
  };
  tenantObj.chrisObj = {
    name: "Chris",
    chore: chrisChores[0],
    email: "chrisemail@gmail.com"
  };
  tenantObj.roanObj = {
    name: "Roan",
    chore: roanChores[0],
    email: "roanemail@gmail.com"
  };

  function queue(nameChores, nameObj)
  {
    //This function is local to the main function, split out (along with messages used) in future if neccessary.
    Logger.log(nameChores);
    if (nameChores[0][0] !== "kitchen" && nameChores[1][0] !== "kitchen") {
      nameChores.unshift(["kitchen"]);
      nameChores.pop();
      nameObj["message"] = kitchenMessage;
      nameObj["htmlMsg"] = htmlKitchen;
    } else if (nameChores[0][0] !== "bathroom" && nameChores[1][0] !== "bathroom") {
      nameChores.unshift(["bathroom"]);
      nameChores.pop();
      nameObj["message"] = bathroomMessage;
      nameObj["htmlMsg"] = htmlBathroom;
    } else if (nameChores[0][0] !== "lounge" && nameChores[1][0] !== "lounge"){
      nameChores.unshift(["lounge"]);
      nameChores.pop();
      nameObj["message"] = loungeMessage;
      nameObj["htmlMsg"] = htmlLounge;
    } else {
      //Also write error to next row in error sheet with date?
      nameObj["message"] = errorMessage;
      nameObj["htmlMsg"] = htmlError;
    }
  }

  queue(dunkChores, tenantObj.dunkObj);
  queue(chrisChores, tenantObj.chrisObj);
  queue(roanChores, tenantObj.roanObj);

  Logger.log("2 D: " + dunkChores + " C: " + chrisChores + " R: " + roanChores);

  sheet.getRange("Memory!B2:B3").setValues(dunkChores);
  sheet.getRange("Memory!C2:C3").setValues(chrisChores);
  sheet.getRange("Memory!D2:D3").setValues(roanChores);

  for (var tenant in tenantObj) {
    var htmlPre = "<body>" +
    "<p>Hi " + tenantObj[tenant].name + "," +
    "<p>Today, " + date + ", you're on";
    var message = "Hi " + tenantObj[tenant].name + ", " + preMessage + tenantObj[tenant].message + "Thanks, AutoDink";
    var htmlMsg = htmlPre + tenantObj[tenant].htmlMsg + htmlPost;
    GmailApp.sendEmail(tenantObj[tenant].email, "Cleaning Rota | Your Weekly Chore", message, {htmlBody: htmlMsg});
  }
}
