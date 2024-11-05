import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import ProductsTable from "../components/products/ProductsTable";
import axios from "axios";

const ProductsPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    avgPrice: 0,
    inventoryValue: 0,
    totalRevenue: 0,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProductsForm, setShowAddProductsForm] = useState(false);
  const [newProducts, setNewProducts] = useState({
    prodName: "",
    price: "",
    prodDescription: "",
    productCategory: "",
  });
  const [formData, setFormData] = useState({
    prodName: "",
    prodDescription: "",
    productCategory: "",
    price: "",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const totalProductsResponse = await fetch(`https://billing-application-backend-production.up.railway.app/analysis/countProducts`);
        const totalProducts = await totalProductsResponse.json();

        const avgPriceResponse = await fetch(`https://billing-application-backend-production.up.railway.app/analysis/avgpricePerProd`);
        const avgPrice = await avgPriceResponse.json();

        const inventoryValueResponse = await fetch(`https://billing-application-backend-production.up.railway.app/analysis/invValue`);
        const inventoryValue = await inventoryValueResponse.json();

        const totalRevenueResponse = await fetch(`https://billing-application-backend-production.up.railway.app/analysis/totalSales`);
        const totalRevenue = await totalRevenueResponse.json();

        console.log({ totalProducts, avgPrice, inventoryValue, totalRevenue }); // Log for debugging

        setStats({
          totalProducts,
          avgPrice,
          inventoryValue,
          totalRevenue: Number(totalRevenue) || 0, // Ensure totalRevenue is a number or fallback to 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://billing-application-backend-production.up.railway.app/api/admin/viewallproducts");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchStats();
    fetchProducts();
  }, []);

  const handleAddProductClick = () => {
    setShowAddProductsForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChangeForNewProduct = (e) => {
    const { name, value } = e.target;
    setNewProducts((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      prodName: product.prodName,
      prodDescription: product.prodDescription,
      productCategory: product.productCategory,
      price: product.price,
    });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://billing-application-backend-production.up.railway.app/api/admin/updateProduct/${selectedProduct.id}`, formData);
      handleClosePopup();
      const response = await axios.get("https://billing-application-backend-production.up.railway.app/api/admin/viewallproducts");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const handleSaveProduct = async () => {
    try {
      await axios.post("https://billing-application-backend-production.up.railway.app/api/admin/addProducts", newProducts);
      const response = await axios.get("https://billing-application-backend-production.up.railway.app/api/admin/viewallproducts");
      setProducts(response.data);
      setShowAddProductsForm(false);
      setNewProducts({ prodName: "", price: "", prodDescription: "", productCategory: "" });
    } catch (error) {
      console.error("There was an error adding the product!", error);
      alert("There was an error adding the product! Please try again.");
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Products" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Products" icon={Package} value={stats.totalProducts} color="#6366F1" />
          <StatCard name="Avg. Price / Prod." icon={TrendingUp} value={stats.avgPrice.toFixed(2) || 0} color="#10B981" />
          <StatCard name="Inventory Value" icon={AlertTriangle} value={stats.inventoryValue || 0} color="#F59E0B" />
          <StatCard name="Total Revenue" icon={DollarSign} value={`₹${(stats.totalRevenue && !isNaN(stats.totalRevenue)) ? stats.totalRevenue.toFixed(2) : 0}`} color="#EF4444" />
        </motion.div>

        <button
          onClick={handleAddProductClick}
          className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          Add Product
        </button>

        <ProductsTable products={products} onEditClick={handleEditClick} />

        <div className="grid grid-col-1 lg gap-8">
          <CategoryDistributionChart />
        </div>
      </main>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl mb-4">Update Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="prodName"
                  value={formData.prodName}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Product Description</label>
                <input
                  type="text"
                  name="prodDescription"
                  value={formData.prodDescription}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="mr-4 bg-gray-300 text-gray-700 p-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddProductsForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-100 mb-4">Add Product</h2>
            <form onSubmit={handleSaveProduct}>
              <div className="mb-4">
                <label className="block text-gray-300">Product Name</label>
                <input
                  type="text"
                  name="prodName"
                  value={newProducts.prodName}
                  onChange={handleInputChangeForNewProduct}
                  className="w-full p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">Price</label>
                <input
                  type="number"
                  name="price"
                  value={newProducts.price}
                  onChange={handleInputChangeForNewProduct}
                  className="w-full p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">Description</label>
                <input
                  type="text"
                  name="prodDescription"
                  value={newProducts.prodDescription}
                  onChange={handleInputChangeForNewProduct}
                  className="w-full p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300">Category</label>
                <input
                  type="text"
                  name="productCategory"
                  value={newProducts.productCategory}
                  onChange={handleInputChangeForNewProduct}
                  className="w-full p-2 rounded"
                  required
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Add Product
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductsPage;
