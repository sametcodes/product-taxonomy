This is a simple Node.js application that classify e-commerce products into the categories of well-known e-commerce websites like Amazon, Shopify and Google Shopping. It supports multiple languages.

It depends on OpenAI Embeddings API to get the embeddings of categories and products. And it uses Langchain/HNSWLib to build a fast and scalable search index.

### Endpoints

There are two endpoints mainly. One is to create vectors and the other is for classifying a product into a category. One is based on Pinecone to keep the vectors and the other is based on HNSWLib to keep the vectors locally. Both of them use OpenAI Embeddings API.

#### Pinecone-based (legacy, slower)
- `POST /category/predict/:platform`
- `POST /category/:platform` - classify a product into a category of given platform and return the category

#### HNSW-based (recommended, faster)
- `POST /v2/product/predict/:platform` - classify a product into a category of given platform and save them locally
- `POST /v2/product/:platform` - classify a product into a category of given platform and return the category

### How to classify new platform categories

First, you need to prepare a list of categories of the platform that you wanted to classify. For instance, [this file](https://help.shopify.com/txt/product_taxonomy/en.txt) is the product taxonomy file of Shopify. You can use it to create a list of categories. The input file should be TSV format, and the first column should be the ID and the second column should be the category name. You can find a sample input file under `sample` folder.

You can also find Postman collection in `postman.json` file.

## Getting Started

### Installation

```bash
npm install
```

### Development

To run the application in development mode:

```bash
npm start
```

### Production

To run the application in production mode:

```bash
npm run build
npm run start:live
```
## Bonus: OpenAI ChatGPT Plugin

This repository also includes a plugin for OpenAI ChatGPT. You can use it to generate a response for a given message. You can find the plugin under `static` folder. If you have access to ChatGPT Plugins, you can load it from `localhost:6006` and use it by asking a question like `What is the best category for a product with name "iPhone 12 Pro Max"?`. Do not forget to run the application. The plugin version uses the HNSW-based endpoint (`/v2`).

## Todo

- [ ] Add different human-languages support at platform-level
- [ ] Remove pinecone-based endpoints once the HNSW-based endpoints are stable
- [ ] Prepare ready-to-use vectors for well-known platforms
