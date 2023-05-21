This is a simple Node.js application that classify e-commerce products into the categories of well-known e-commerce websites like Amazon, Shopify and Google Shopping. It supports multiple languages.

It depends on OpenAI Embeddings API to get the embeddings of categories and products. And it uses Langchain/HNSWLib to build a fast and scalable search index.

### Available endpoints

There are two endpoints mainly. One is to create vectors and the other is for classifying a product into a category. One is based on Pinecone to keep the vectors and the other is based on HNSWLib to keep the vectors locally. Both of them use OpenAI Embeddings API.
### Pinecone-based (legacy, slower)
- `POST /category/predict/:platform`
- `POST /category/:platform` - classify a product into a category of given platform and return the category

### HNSW-based (recommended, faster)
- `POST /v2/product/predict/:platform` - classify a product into a category of given platform and save them locally
- `POST /v2/product/:platform` - classify a product into a category of given platform and return the category

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