import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import ProductsTable from "../components/products/ProductsTable";
import axios from "axios";

// Notification Component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Hide notification after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 p-4 rounded shadow-lg ${type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}>
      {message}
    </div>
  );
};

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
  const [notification, setNotification] = useState({ visible: false, message: "", type: "" }); // Notification state

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

        setStats({
          totalProducts,
          avgPrice,
          inventoryValue,
          totalRevenue,
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

  const showNotification = (message, type) => {
    setNotification({ visible: true, message, type });
  };

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
      showNotification("Product updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update product", error);
      showNotification("Failed to update product.", "error");
    }
  };

  const handleSaveProduct = async () => {
    try {
      await axios.post("https://billing-application-backend-production.up.railway.app/api/admin/addProducts", newProducts);
      const response = await axios.get("https://billing-application-backend-production.up.railway.app/api/admin/viewallproducts");
      setProducts(response.data);
      setShowAddProductsForm(false);
      setNewProducts({ prodName: "", price: "", prodDescription: "", productCategory: "" });
      showNotification("Product added successfully!", "success");
    } catch (error) {
      console.error("There was an error adding the product!", error);
      showNotification("Error adding product. Please try again.", "error");
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
          <StatCard name="Total Revenue" icon={DollarSign} value={`₹${stats.totalRevenue.toFixed(2) || 0}`} color="#EF4444" />
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

      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )}

      {/* Popup and Form Components */}
    </div>
  );
};

export default ProductsPage;
