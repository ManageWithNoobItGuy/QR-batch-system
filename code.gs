/**
 * ฟังก์ชันหลักที่ทำหน้าที่เป็น Web Application
 * @return {HtmlOutput} แสดงผลหน้าเว็บ
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate();
}

/**
 * ฟังก์ชันนี้ใช้สำหรับรับข้อมูลจากฟอร์ม HTML และบันทึกข้อมูลลงใน Google Sheets
 * @param {Object} formData ข้อมูลที่ส่งมาจากฟอร์มในหน้าเว็บ
 * @return {Object} ผลลัพธ์ของการบันทึกข้อมูล
 */
function processForm(formData) {
  try {
    const spreadsheetId = "1EBu_H_Dda_ACzj26hTZEOtI6-qbxuLwlqVoB_3lqLdw"; // ใส่ Google Sheet ID ของคุณที่นี่
    const sheetName = "บันทึกรับเข้า";
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);

    if (!sheet) {
      throw new Error(`ไม่พบชีทชื่อ "${sheetName}"`);
    }

    // Convert the date string from the form into a proper Date object
    const receivedDate = Utilities.parseDate(formData.receiveDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

    // Get the current timestamp as a 13-digit number (milliseconds since epoch)
    const timestampNumber = new Date().getTime();

    const rowData = [
      timestampNumber,
      receivedDate,
      formData.meatType,
      parseFloat(formData.weight)
    ];

    sheet.appendRow(rowData);

    // Create a URL for the QR Code from the numeric timestamp
    const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(timestampNumber.toString())}&size=300`;

    // Send the data back to the webpage for display
    return {
      success: true,
      qrCodeUrl: qrCodeUrl,
      meatType: formData.meatType,
      weight: formData.weight,
      receivedDate: Utilities.formatDate(receivedDate, Session.getScriptTimeZone(), "dd/MM/yyyy"),
      qrCodeText: timestampNumber.toString() // Ensure this is sent back for display
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
