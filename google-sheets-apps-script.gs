/**
 * ════════════════════════════════════════════════════════════════════════════
 * CITY MITRA — Google Sheets Backend (Google Apps Script)
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Instructions to Deploy:
 * 1. Open Google Sheets (create a new blank spreadsheet, e.g. "City Mitra Database").
 * 2. In top menu, click Extensions -> Apps Script.
 * 3. Delete any code in Code.gs and paste ALL the code below.
 * 4. Click "Deploy" (blue button top right) -> "New deployment".
 * 5. Select type: "Web app".
 * 6. Description: "City Mitra Form Handler".
 * 7. Execute as: "Me" (your email).
 * 8. Who has access: "Anyone" (CRITICAL for receiving form submissions).
 * 9. Click "Deploy", Authorize permissions, and COPY the Web App URL.
 * 10. Paste that Web App URL in `js/google-sheets.js` at `GOOGLE_SHEET_CONFIG.SCRIPT_URL`.
 * ════════════════════════════════════════════════════════════════════════════
 */

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", message: "City Mitra Google Sheets API is running!" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30s for concurrent writes
  lock.tryLock(30000);

  try {
    var rawData = e.postData.contents;
    var data = {};
    
    try {
      data = JSON.parse(rawData);
    } catch (err) {
      // Fallback for url-encoded form data
      data = e.parameter;
    }

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var formType = data.type || "contact"; // "city_request" or "contact" or "newsletter"
    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    if (formType === "city_request") {
      var sheet = doc.getSheetByName("City_Requests");
      if (!sheet) {
        sheet = doc.insertSheet("City_Requests");
        sheet.appendRow(["Timestamp", "City Name", "State / UT", "Requester Name", "Email / Phone", "Notes / Why", "Device / Context"]);
        sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#EA580C").setFontColor("#FFFFFF");
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([
        formattedDate,
        data.cityName || "",
        data.state || "",
        data.name || "Anonymous Citizen",
        data.contact || "",
        data.notes || "",
        data.context || "Web App"
      ]);
    } else if (formType === "newsletter") {
      var sheet = doc.getSheetByName("Newsletter_Subscribers");
      if (!sheet) {
        sheet = doc.insertSheet("Newsletter_Subscribers");
        sheet.appendRow(["Timestamp", "Email", "Status", "Source"]);
        sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([
        formattedDate,
        data.email || "",
        "Subscribed",
        data.source || "Homepage Footer"
      ]);
    } else {
      // Default: Contact messages
      var sheet = doc.getSheetByName("Contact_Messages");
      if (!sheet) {
        sheet = doc.insertSheet("Contact_Messages");
        sheet.appendRow(["Timestamp", "Name", "Email", "Subject", "Message", "City"]);
        sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#1E293B").setFontColor("#FFFFFF");
        sheet.setFrozenRows(1);
      }
      sheet.appendRow([
        formattedDate,
        data.name || "",
        data.email || "",
        data.subject || "General Inquiry",
        data.message || "",
        data.city || "All"
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", type: formType, timestamp: formattedDate }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
