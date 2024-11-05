import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const InvoicePage = () => {
  const [formData, setFormData] = useState({
    clientId: "",
    items: [{ productId: "", quantity: 1, price: 0 }],
  });

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("https://billing-application-backend-production.up.railway.app/api/users/displayCus")
      .then((response) => response.json())
      .then((data) => {
        setClients(data);
        console.log("Fetched Clients:", data);
      });

    fetch("https://billing-application-backend-production.up.railway.app/api/admin/viewallproducts")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        console.log("Fetched Products:", data);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;

    if (name === "productId") {
      const selectedProduct = products.find((p) => p.id.toString() === value);
      updatedItems[index].price = selectedProduct ? selectedProduct.price : 0;
    }

    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://billing-application-backend-production.up.railway.app/api/accountant/createInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        customerId: formData.clientId,
        productIds: formData.items.map((item) => item.productId).join(","),
        quantities: formData.items.map((item) => item.quantity).join(","),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((invoice) => {
        console.log("Invoice created:", invoice);
        generatePDF(invoice);
      })
      .catch((error) => {
        console.error("Error creating invoice:", error);
      });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Load and add the logo image
    const logo = new Image();
    logo.src = "/invoice.jpg";
    logo.onload = () => {
      // Logo and Title
      doc.addImage(logo, "JPG", 20, 10, 150, 40);
      doc.setFontSize(22);
      doc.setTextColor(34, 68, 102);  // Darker color for title
      doc.text("Invoice", 105, 60, { align: "center" });
      
      // Customer Information Section
      const selectedClient = clients.find(
        (c) => c.id.toString() === formData.clientId
      );
      
      doc.setFontSize(14);
      doc.setTextColor(34, 34, 34);
      if (selectedClient) {
        doc.setFont("helvetica", "bold");
        doc.text("Customer Information", 20, 80);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${selectedClient.name}`, 20, 90);
        doc.text(`Email: ${selectedClient.email}`, 20, 100);
        doc.text(`Address: ${selectedClient.city}`, 20, 110);
        doc.text(`Mobile Number: ${selectedClient.mobileNumber}`, 20, 120);
      } else {
        doc.text("Client information is not available.", 20, 90);
      }
  
      // Products Table Header
      const startY = 140;
      const rowHeight = 10;
      const headers = ["Product", "Quantity", "Price", "Total"];
      const columnWidths = [60, 30, 40, 40];
      
      doc.setFontSize(12);
      doc.setFillColor(34, 68, 102);  // Dark blue for header background
      doc.setTextColor(255, 255, 255); // White text for headers
      doc.rect(
        20,
        startY,
        columnWidths.reduce((a, b) => a + b, 0),
        rowHeight,
        "F"
      );
  
      headers.forEach((header, index) => {
        doc.text(
          header,
          20 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5,
          startY + 7
        );
      });
  
      // Product Rows
      doc.setTextColor(0, 0, 0);  // Black text for content
      formData.items.forEach((item, index) => {
        const selectedProduct = products.find(
          (p) => p.id.toString() === item.productId
        );
        const y = startY + (index + 1) * rowHeight + 5;
        
        const totalPrice = selectedProduct ? 
                           (item.quantity * selectedProduct.price).toFixed(2) : 
                           "N/A";
        
        doc.setFont("helvetica", "normal");
        if (selectedProduct) {
          doc.text(selectedProduct.prodName, 25, y);
          doc.text(item.quantity.toString(), 85, y);
          doc.text(`Rs ${selectedProduct.price.toFixed(2)}`, 115, y);
          doc.text(`Rs ${totalPrice}`, 155, y);
        } else {
          doc.text("Product: Not Found", 25, y);
        }
  
        // Draw borders
        columnWidths.reduce((x, width, idx) => {
          doc.rect(20 + x, y - 5, width, rowHeight, "S");
          return x + width;
        }, 0);
      });
  
      // Total Amount
      const total = calculateTotal();
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Total: Rs ${total.toFixed(2)}`,
        160,
        startY + (formData.items.length + 2) * rowHeight + 10
      );
  
      // Save the PDF
      doc.save("invoice.pdf");
    };
  
    logo.onerror = () => {
      console.error("Error loading logo image");
      doc.setFontSize(18);
      doc.text("Invoice", 105, 20, { align: "center" });
      doc.save("invoice.pdf");
    };
  };
  
  const currentItems = formData.items.slice(0, itemsPerPage);
  const indexOfFirstItem = 0; // Assuming pagination starts from the first item

  return (
    <div className="flex items-center justify-center min-h-screen w-full ">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Create an Invoice
        </h2>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Client:
            </label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-gray-700">
                Select Client
              </option>
              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                  className="text-gray-700"
                >
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          <h3 className="text-2xl font-bold mb-4 text-gray-800">Items</h3>
          <div className="max-h-96 overflow-y-auto">
            {currentItems.map((item, index) => (
              <div key={index} className="mb-4 flex items-center space-x-4">
                <select
                  name="productId"
                  value={item.productId}
                  onChange={(e) =>
                    handleItemChange(indexOfFirstItem + index, e)
                  }
                  required
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" className="text-gray-700">
                    Select Product
                  </option>
                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                      className="text-gray-700"
                    >
                      {product.prodName} (Rs {product.price})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(indexOfFirstItem + index, e)}
                  required
                  className="w-20 p-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeItem(indexOfFirstItem + index)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Item
          </button>

          <div className="text-right text-xl font-bold text-gray-700">
            Total: Rs {calculateTotal().toFixed(2)}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Create and Download Invoice PDF
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoicePage;
