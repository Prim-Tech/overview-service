const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number
});

const stylesSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  style_id: Number,
  name: String,
  original_price: Number,
  sale_price: Number,
  default_style: String
});

const photosSchema = new mongoose.Schema({
  style_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Style' },
  thumbnail_url: String,
  url: String
});

const skusSchema = new mongoose.Schema({
  style_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Style' },
  sku_id: Number,
  quantity: Number,
  size: String
});

const featuresSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  feature: String,
  value: String
});

const relatedItemsSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});

const Product = mongoose.model('Product', productSchema);
const Style = mongoose.model('Style', stylesSchema);
const Photo = mongoose.model('Photo', photosSchema);
const Sku = mongoose.model('Sku', skusSchema);
const Feature = mongoose.model('Feature', featuresSchema);
const RelatedItem = mongoose.model('RelatedItem', relatedItemsSchema);

module.exports = {
  Product,
  Style,
  Photo,
  Sku,
  Feature,
  RelatedItem
};
