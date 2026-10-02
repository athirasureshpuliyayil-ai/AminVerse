const ExcelJS = require('exceljs');

async function createDailyGanttChart() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Daily Gantt Chart', {
    views: [{ showGridLines: true }]
  });

  // Project Info
  const projectName = 'CarePulse';
  const clientName = 'HealthCare Corp';
  
  // Tasks WBS Data for CarePulse project
  const tasks = [
    { id: 'T01', name: 'Contract Signing & Scope', start: '2026-05-01', end: '2026-05-02' },
    { id: 'T02', name: 'System Architecture & DB Design', start: '2026-05-03', end: '2026-05-05' },
    { id: 'T03', name: 'UI/UX Design & Wireframing', start: '2026-05-04', end: '2026-05-08' },
    { id: 'T04', name: 'Patient Portal Module', start: '2026-05-07', end: '2026-05-13' },
    { id: 'T05', name: 'Doctor Scheduling & Appointments', start: '2026-05-11', end: '2026-05-16' },
    { id: 'T06', name: 'Telehealth Video Consultation Integration', start: '2026-05-15', end: '2026-05-20' },
    { id: 'T07', name: 'EHR & Prescription Engine', start: '2026-05-18', end: '2026-05-23' },
    { id: 'T08', name: 'Payment Gateway & Billing', start: '2026-05-21', end: '2026-05-24' },
    { id: 'T09', name: 'HIPAA & Security Compliance Audit', start: '2026-05-23', end: '2026-05-26' },
    { id: 'T10', name: 'System Integration & QA Testing', start: '2026-05-25', end: '2026-05-28' },
    { id: 'T11', name: 'User Acceptance Testing (UAT)', start: '2026-05-27', end: '2026-05-29' },
    { id: 'T12', name: 'Admin Dashboard & Analytics', start: '2026-05-28', end: '2026-05-30' },
    { id: 'T13', name: 'Production Deployment', start: '2026-05-30', end: '2026-05-31' },
    { id: 'T14', name: 'Post-Launch Handover & Acceptance', start: '2026-05-31', end: '2026-05-31' }
  ];

  // Helper to parse date strings
  const parseDate = (str) => new Date(str + 'T00:00:00');

  // Compute Overall Project Start and End Dates
  let projectStartDate = parseDate(tasks[0].start);
  let projectEndDate = parseDate(tasks[0].end);

  tasks.forEach(task => {
    const s = parseDate(task.start);
    const e = parseDate(task.end);
    if (s < projectStartDate) projectStartDate = s;
    if (e > projectEndDate) projectEndDate = e;
  });

  // Generate array of calendar days between projectStartDate and projectEndDate
  const dateList = [];
  let curr = new Date(projectStartDate);
  while (curr <= projectEndDate) {
    dateList.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }

  // Define Column Mapping
  // A: Task ID, B: Task Name, C: Start Date, D: End Date, E: Duration (In Days), F+: Daily Dates
  worksheet.getColumn(1).width = 10;  // Task ID
  worksheet.getColumn(2).width = 38;  // Task Name
  worksheet.getColumn(3).width = 14;  // Start Date
  worksheet.getColumn(4).width = 14;  // End Date
  worksheet.getColumn(5).width = 18;  // Duration (In Days)

  dateList.forEach((_, idx) => {
    worksheet.getColumn(6 + idx).width = 3.6; // Timeline daily columns
  });

  // Color Palette Constants
  const BLUE_HEADER = '1F4E79';     // Dark blue for title and remarks
  const HEADER_GRAY = 'D9D9D9';     // Gray background for table header
  const BAR_BLUE = '2F75B5';        // Vibrant Gantt bar blue
  const LIGHT_TEXT_GRAY = '595959'; // Gray for sub-label headers
  const BORDER_GRAY = 'BFBFBF';     // Thin border color

  const thinBorder = {
    top: { style: 'thin', color: { argb: BORDER_GRAY } },
    left: { style: 'thin', color: { argb: BORDER_GRAY } },
    bottom: { style: 'thin', color: { argb: BORDER_GRAY } },
    right: { style: 'thin', color: { argb: BORDER_GRAY } }
  };

  // --- 1. TITLE SECTION (Row 2) ---
  const totalCols = 5 + dateList.length;
  worksheet.mergeCells(2, 6, 2, totalCols);
  const titleCell = worksheet.getCell(2, 6);
  titleCell.value = 'DAILY GANTT CHART TEMPLATE';
  titleCell.font = { name: 'Calibri', size: 20, bold: true, color: { argb: BLUE_HEADER } };
  titleCell.alignment = { horizontal: 'right', vertical: 'middle' };

  // --- 2. PROJECT INFO FIELDS (Row 4 & Row 5) ---
  // Format Date for Header display (e.g. 01-May-26)
  const formatHeaderDate = (d) => {
    const day = String(d.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${monthNames[d.getMonth()]}-${year}`;
  };

  // Project Name
  worksheet.mergeCells(4, 1, 4, 2);
  const pNameVal = worksheet.getCell(4, 1);
  pNameVal.value = projectName;
  pNameVal.font = { name: 'Calibri', size: 12, bold: true };
  pNameVal.alignment = { horizontal: 'left', vertical: 'bottom' };

  worksheet.mergeCells(5, 1, 5, 2);
  const pNameLbl = worksheet.getCell(5, 1);
  pNameLbl.value = 'PROJECT NAME';
  pNameLbl.font = { name: 'Calibri', size: 9, bold: true, color: { argb: LIGHT_TEXT_GRAY } };
  pNameLbl.alignment = { horizontal: 'left', vertical: 'top' };
  pNameLbl.border = { top: { style: 'thin', color: { argb: '000000' } } };

  // Client Name
  worksheet.mergeCells(4, 3, 4, 4);
  const cNameVal = worksheet.getCell(4, 3);
  cNameVal.value = clientName;
  cNameVal.font = { name: 'Calibri', size: 12, bold: true };
  cNameVal.alignment = { horizontal: 'left', vertical: 'bottom' };

  worksheet.mergeCells(5, 3, 5, 4);
  const cNameLbl = worksheet.getCell(5, 3);
  cNameLbl.value = 'CLIENT NAME';
  cNameLbl.font = { name: 'Calibri', size: 9, bold: true, color: { argb: LIGHT_TEXT_GRAY } };
  cNameLbl.alignment = { horizontal: 'left', vertical: 'top' };
  cNameLbl.border = { top: { style: 'thin', color: { argb: '000000' } } };

  // Start Date (Right aligned header info)
  const startColIdx = Math.max(6, totalCols - 7);
  const endColIdx = Math.max(8, totalCols - 3);

  worksheet.mergeCells(4, startColIdx, 4, startColIdx + 1);
  const sDateVal = worksheet.getCell(4, startColIdx);
  sDateVal.value = formatHeaderDate(projectStartDate);
  sDateVal.font = { name: 'Calibri', size: 11, bold: true };
  sDateVal.alignment = { horizontal: 'center', vertical: 'bottom' };

  worksheet.mergeCells(5, startColIdx, 5, startColIdx + 1);
  const sDateLbl = worksheet.getCell(5, startColIdx);
  sDateLbl.value = 'START DATE';
  sDateLbl.font = { name: 'Calibri', size: 9, bold: true, color: { argb: LIGHT_TEXT_GRAY } };
  sDateLbl.alignment = { horizontal: 'center', vertical: 'top' };
  sDateLbl.border = { top: { style: 'thin', color: { argb: '000000' } } };

  // End Date
  worksheet.mergeCells(4, endColIdx, 4, endColIdx + 1);
  const eDateVal = worksheet.getCell(4, endColIdx);
  eDateVal.value = formatHeaderDate(projectEndDate);
  eDateVal.font = { name: 'Calibri', size: 11, bold: true };
  eDateVal.alignment = { horizontal: 'center', vertical: 'bottom' };

  worksheet.mergeCells(5, endColIdx, 5, endColIdx + 1);
  const eDateLbl = worksheet.getCell(5, endColIdx);
  eDateLbl.value = 'END DATE';
  eDateLbl.font = { name: 'Calibri', size: 9, bold: true, color: { argb: LIGHT_TEXT_GRAY } };
  eDateLbl.alignment = { horizontal: 'center', vertical: 'top' };
  eDateLbl.border = { top: { style: 'thin', color: { argb: '000000' } } };

  // --- 3. MAIN TABLE HEADER ROW (Row 7) ---
  const headerRow = worksheet.getRow(7);
  headerRow.height = 70;

  const mainHeaders = ['Task ID', 'Task Name', 'Start Date', 'End Date', 'Duration (In Days)'];
  mainHeaders.forEach((text, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = text;
    cell.font = { name: 'Calibri', size: 10, bold: true };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_GRAY } };
    cell.border = thinBorder;
  });

  // Date Header Columns
  dateList.forEach((date, i) => {
    const cell = headerRow.getCell(6 + i);
    cell.value = date;
    cell.numFmt = 'm/d/yyyy';
    cell.font = { name: 'Calibri', size: 9, bold: true };
    cell.alignment = { textRotation: 90, horizontal: 'center', vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_GRAY } };
    cell.border = thinBorder;
  });

  // --- 4. TASK DATA ROWS ---
  let currentRow = 8;
  tasks.forEach((t) => {
    const row = worksheet.getRow(currentRow);
    row.height = 20;

    const startDate = parseDate(t.start);
    const endDate = parseDate(t.end);

    // Task ID
    const cellId = row.getCell(1);
    cellId.value = t.id;
    cellId.font = { name: 'Calibri', size: 10 };
    cellId.alignment = { horizontal: 'center', vertical: 'middle' };
    cellId.border = thinBorder;

    // Task Name
    const cellName = row.getCell(2);
    cellName.value = t.name;
    cellName.font = { name: 'Calibri', size: 10 };
    cellName.alignment = { horizontal: 'left', vertical: 'middle' };
    cellName.border = thinBorder;

    // Start Date (Native Date object)
    const cellStart = row.getCell(3);
    cellStart.value = startDate;
    cellStart.numFmt = 'm/d/yyyy';
    cellStart.font = { name: 'Calibri', size: 10 };
    cellStart.alignment = { horizontal: 'center', vertical: 'middle' };
    cellStart.border = thinBorder;

    // End Date (Native Date object)
    const cellEnd = row.getCell(4);
    cellEnd.value = endDate;
    cellEnd.numFmt = 'm/d/yyyy';
    cellEnd.font = { name: 'Calibri', size: 10 };
    cellEnd.alignment = { horizontal: 'center', vertical: 'middle' };
    cellEnd.border = thinBorder;

    // Duration formula: Excel formula =D{currentRow}-C{currentRow}+1
    const cellDur = row.getCell(5);
    const calcDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    cellDur.value = { formula: `D${currentRow}-C${currentRow}+1`, result: calcDays };
    cellDur.font = { name: 'Calibri', size: 10 };
    cellDur.alignment = { horizontal: 'center', vertical: 'middle' };
    cellDur.border = thinBorder;

    // Gantt Timeline cells
    dateList.forEach((date, i) => {
      const cell = row.getCell(6 + i);
      cell.border = thinBorder;

      if (date >= startDate && date <= endDate) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BAR_BLUE } };
      }
    });

    currentRow++;
  });

  // --- 5. REMARKS / FOOTER SECTION ---
  currentRow += 1;
  worksheet.mergeCells(currentRow, 1, currentRow, totalCols);
  const remarksBanner = worksheet.getCell(currentRow, 1);
  remarksBanner.value = 'Remarks:';
  remarksBanner.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFF' } };
  remarksBanner.alignment = { horizontal: 'left', vertical: 'middle' };
  remarksBanner.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_HEADER } };
  worksheet.getRow(currentRow).height = 22;

  currentRow += 1;
  worksheet.mergeCells(currentRow, 1, currentRow, totalCols);
  const remarksText = worksheet.getCell(currentRow, 1);
  remarksText.value = 'Thirty (30) days warranty starts after acceptance of the project';
  remarksText.font = { name: 'Calibri', size: 10, italic: false };
  remarksText.alignment = { horizontal: 'left', vertical: 'middle' };

  // Write file
  const fileName = 'CarePulse_Daily_Gantt_Chart.xlsx';
  await workbook.xlsx.writeFile(fileName);
  console.log(`Successfully generated Gantt chart Excel file: ${fileName}`);
}

createDailyGanttChart().catch(err => {
  console.error('Error generating Gantt chart:', err);
});
