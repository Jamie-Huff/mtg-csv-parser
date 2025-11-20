import fs from 'fs';
import path from 'path';

/*
- check with morgan if he wants it to only add or if he wants it to add and update qty if product exists
- need to make sure we have the exact same sets as what scryfall uses to avoid import issues
CSV ORDER:

Product Name: string
Category: string - this should be the sets full name ie: Theros Beyond Death
Add Qty: number (must be positive otherwise it would decrease the quantity)
*/

function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(','); // Assuming first line is headers
    const rows = []; // output

    // entire point of this gross loop is to handle the fact that csv values are split by a comma, but a property might have a common in it aswell
    // this will go through each character in the line and only split on commas that are outside of quotes. Just an extra complex .split('\n')
    for (let lineNum = 1; lineNum < lines.length; lineNum++) { // start on line 1 because line 0 is headers
        const values = [];
        let currentValue = '';
        let inQuotes = false;
        for (let lineField = 0; lineField < lines[lineNum].length; lineField++) {
            const char = lines[lineNum][lineField];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) { // only split on commas outside quotes to handle the event that a product has a comma in its name
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim()); // Add the last value as it will be skipped over

        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index];
            });
            rows.push(row);
        }
    }

    return rows;
}

function convertToExportFormat(data) {
    return data.map(row => {
      const output = {
        'Product Name': row['Name'] || '',
        'Category': row['Set name'] || '',
        'Add Qty': parseInt(row['Quantity']) || 0
      };

      // check to see if a field has an empty value. If it does the crystal commerece parser won't work properly so we need to throw an error and not continue
      for (const key in output) {
        if (output[key] === '') {
          console.log('empty field')
          throw new Error(`Missing required field: ${key}`);
        }
      }

      return output
    });
}

function generateCSV(data) {
    const headers = ['Product Name', 'Category', 'Add Qty'];
    const csvLines = [headers.join(',')];

    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Escape values that contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvLines.push(values.join(','));
    });

    return csvLines.join('\n');
}

function processCardData() {
    try {
        const importPath = path.join(process.cwd(), 'import.csv');

        if (!fs.existsSync(importPath)) {
            console.error('Error: import.csv file not found');
            return;
        }

        const csvData = fs.readFileSync(importPath, 'utf8');
        const parsedData = parseCSV(csvData);
        console.log(`Processed ${parsedData.length} cards from import.csv`);

        const exportData = convertToExportFormat(parsedData);
        const outputCSV = generateCSV(exportData);

        const currentDate = getCurrentDate();
        const outputFileName = `export-${currentDate.replace(/\//g, '-')}.csv`;
        const outputPath = path.join(process.cwd(), outputFileName);

        fs.writeFileSync(outputPath, outputCSV, 'utf8');

        console.log(`✅ Successfully created ${outputFileName}`);
        console.log(`📁 Saved to: ${outputPath}`);
        console.log(`📊 Exported ${exportData.length} cards`);

    } catch (error) {
        console.error('Error processing card data:', error.message);
    }
}

processCardData();
