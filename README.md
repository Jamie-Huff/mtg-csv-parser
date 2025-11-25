# MTG North Card Scanner

## Goal

The goal of this script is to take a CSV file output by an MTG card scanning application, specifically **Manabox**, feed it into this script, and get a new CSV output that can be used to update your inventory for an ecommerce platform, in this case **Crystal Commerce**.

## Using Manabox

Making sure you select the correct printing of the card.

## Potential Issues

- **Set Name Formatting**: Manabox exports the "set name" to be formatted exactly the same as Scryfall. If your "category" on Crystal Commerce is not formatted the same way it could run into an issue.
- **Missing Cards**: Need to test to see what happens if the card doesn't exist in Manabox.
- **Performance**: This isn't optimized at all, might have to revisit the time complexity of the script to let it handle bigger input files if that becomes an issue.
- **Inventory Updates**: The export field needs to be "Add Qty" to ensure that Crystal Commerce adds it to the inventory and doesn't just override the existing quantity.

## Usage

1. Scan cards on Manabox
2. Move the scanned cards over to a binder once complete
3. Click the three dots in the top corner of the binder to export to a CSV file
4. Somehow send it to your computer (maybe this works on mobile idk), probably just email it to yourself
5. Open up the HTML page in your local browser by double clicking on the document or through the hosting on GitHub Pages, drag in/upload your Manabox CSV file
6. The page will automatically download the exported CSV
7. Head to your Crystal Commerce inventory, click on mass import, select "includes multiple categories"

## Customization

Customize the `convertToExportFormat` function's output with your desired import and export fields. Structured like:
```javascript
{
    {export heading name}: row[{import heading name}]
}
```
