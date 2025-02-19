const { google } = require("googleapis");
const fs = require("fs");
const path = require('path')

const SPREADSHEET_ID = process.env.SHEET_ID; // Replace with your Google Sheet ID

const credentials = JSON.parse(fs.readFileSync(path.resolve(__dirname, "credentials.json")));

async function addUserToSheet(name, phone, gander, email, birthDate, city, address, passport, exam_date, link) {
   const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
   });

   const sheets = google.sheets({ version: "v4", auth });

   // Append new user to Sheet1 starting from row A2
   await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A2:J", // Start appending from row 2, columns A to C
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS", // This ensures new rows are added
      resource: {
         values: [[name, phone, gander, email, birthDate, city, address, passport, exam_date, link]], // Data to append
      },
   });

   console.log("User added:", name, phone, email);
}

module.exports = {
   addUserToSheet
}