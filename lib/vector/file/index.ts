import xlsx from "node-xlsx";

const resolveRow = (row: string[], index: number) => {
    const headers = ["Handle", "Title", "Body(HTML)", "Vendor", "Product Category", "Type", "Tags", "Published", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value", "Option3 Name", "Option3 Value", "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable", "Variant Barcode", "Image Src", "Image Position", "Image Alt Text", "Gift Card", "SEO Title", "SEO Description", "Google Shopping / Google Product Category", "Google Shopping / Gender", "Google Shopping / Age Group", "Google Shopping / MPN", "Google Shopping / AdWords Grouping", "Google Shopping / AdWords Labels", "Google Shopping / Condition", "Google Shopping / Custom Product", "Google Shopping / Custom Label 0", "Google Shopping / Custom Label 1", "Google Shopping / Custom Label 2", "Google Shopping / Custom Label 3", "Google Shopping / Custom Label 4", "Variant Image", "Variant Weight Unit", "Variant Tax Code", "Cost per item", "Included / Turkey", "Included / International", "Price / International", "Compare At Price / International", "Status"];
    return headers.reduce((acc: {[key: string]: any}, header, index) => {
        acc[header] = row[index];
        return acc;
    }, {});
}

export const readFile = () => {
    const file = xlsx.parse("./file/products.xlsx");
    if (!file) throw new Error('Input file is not defined.');

    return file[0].data.slice(1).map((value, index) => resolveRow(value as string[], index));
}