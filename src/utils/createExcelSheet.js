import * as ExcelJS from 'exceljs';

// accepts array of json data and returns sheet
export const createExcelSheet = async (data) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('report');
        if (data.length === 0) {
            return workbook;
        }
        // Dynamically create columns based on keys
        const keys = Object.keys(data[0]);
        const columns = keys.map(key => ({
            header: key,
            key: key,
            width: 20
        }));
        worksheet.columns = columns;
        data.forEach((item) => {
            const row = { ...item };
            worksheet.addRow(row);
        });
        return workbook;
    } catch (err) {
        throw new Error(err.message)
    }
};