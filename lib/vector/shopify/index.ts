import fetch from "node-fetch";

export const getCategoryTaxonomy = async (params?: {
    lang?: string,
}) => {
    const { lang = "en" } = params || {};
    const data = await fetch(`https://help.shopify.com/txt/product_taxonomy/${lang}.txt`)
        .then((response) => response.text());
    return data.split("\n")
        .map((line) => {
            const [categoryId, categoryName] = line.split(" - ");
            return { categoryId, categoryName }
        }).slice(1)
}