import { motion } from "framer-motion";
import { Edit, Search, Trash2, Save, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://billing-application-backend-production.up.railway.app/api/admin/viewallproducts");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else {
          console.error("Response data is not an array", response.data);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(
      (product) =>
        product.prodName.toLowerCase().includes(term) ||
        product.productCategory.toLowerCase().includes(term) ||
        product.prodDescription.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://billing-application-backend-production.up.railway.app/api/admin/deleteProduct/${id}`);
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };
  const handleEditClick = (product) => {
    setEditProduct(product); 
    setIsEditing(true); 
  };

  
  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `https://billing-application-backend-production.up.railway.app/api/admin/updateProduct/${editProduct.id}`,
        editProduct
      );
      const updatedProducts = products.map((product) =>
        product.id === editProduct.id ? response.data : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts); 
      setIsEditing(false);
      setEditProduct(null); 
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Product Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isEditing && editProduct?.id === product.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="prodName"
                          value={editProduct.prodName}
                          onChange={handleInputChange}
                          className="bg-gray-700 text-white p-2 rounded-lg w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="prodDescription"
                          value={editProduct.prodDescription}
                          onChange={handleInputChange}
                          className="bg-gray-700 text-white p-2 rounded-lg w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="productCategory"
                          value={editProduct.productCategory}
                          onChange={handleInputChange}
                          className="bg-gray-700 text-white p-2 rounded-lg w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          name="price"
                          value={editProduct.price}
                          onChange={handleInputChange}
                          className="bg-gray-700 text-white p-2 rounded-lg w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex gap-2">
                        <button
                          className="text-green-400 hover:text-green-300"
                          onClick={handleUpdateProduct}
                        >
                          <Save size={18} />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => setIsEditing(false)}
                        >
                          <XCircle size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                        <img
                          src="https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww"
                          alt="Product img"
                          className="size-10 rounded-full"
                        />
                        {product.prodName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {product.prodDescription}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {product.productCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ₹ {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex gap-2">
                        <button
                          className="text-indigo-400 hover:text-indigo-300"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-300">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductsTable;
