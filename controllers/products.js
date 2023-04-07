const Product = require("../models/product")

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
  res.status(200).json({ products, nbHits: products.length })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, field, numericFilter } = req.query
  const queryObject = {}
  const filterObject = {}
  if (featured) {
    queryObject.featured = featured === "true" ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" }
  }
  if (sort) {
    filterObject.sort = sort.replace(",", " ")
  } else {
    filterObject.sort = "createdAt"
  }
  if (field) {
    filterObject.select = field.replace(",", " ")
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const products = await Product.find(queryObject)
    .sort(filterObject.sort)
    .select(filterObject.select)
    .limit(limit)
    .skip((page - 1) * limit)
  res.status(200).json({ products, nbHits: products.length })
}

module.exports = { getAllProducts, getAllProductsStatic }
