## Goal
The goal of this script is to take a take a CSV file output by an mtg card scanning application, specifically Manabox, feed it into this script, and get a new csv output that can be used to update your inventory for an ecommerece platform, in this case Crystal Commerece.

## Using manabox
Making sure you select the correct printing of the card

## Potential issues
- Manabox exports the "set name" to be formated exactly the same as scryfall. If your "category" on crystal commerece is not formatted the same way it could run into an issue.
- Need to test to see what happens if the card doesn't exist in manabox.

## Useage
- scan cards on manabox
- move the scanned cards over to a binder once complete
- click the three dots in the top corner of the binder to export to a csv file
- feed the csv file into this script, right now it looks for a file called "import.csv" in the same working directory that the script lives in.
- customize the `convertToExportFormat` function's output with your desired import and export fields. structured like:
{ {export heading name}: row[{import heading name}] }
- get the export csv, currently saved as {todays date}.csv
