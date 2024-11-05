import { useState, useEffect } from "react";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import AccountantTable from "../components/users/AccountantTable";
import axios from "axios";

const UsersPage = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    customerAddedweek: 0,
  });
  const userType = window.localStorage.getItem("userType");

  const [editUser, setEditUser] = useState(null); // State to handle the currently edited user
  const [editAccountant, setEditAccountant] = useState(null); // State for editing accountants
  const [users, setUsers] = useState([]); // State to handle the list of users
  const [accountants, setAccountants] = useState([]); // State to handle the list of accountants
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false); // State to handle the add customer form visibility
  const [showAddAccountantForm, setShowAddAccountantForm] = useState(false); // State to handle the add customer form visibility
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", city: "", mobileNumber: "", password: "" }); // State for new customer input
  const [newAccountant, setNewAccountant] = useState({ name: "", email: "", city: "", mobileNumber: "", password: "" }); // State for new customer input
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalCustomersResponse = await axios.get("https://billing-application-backend-production.up.railway.app/analysis/countCustomer");
        const customersAddedTodayResponse = await axios.get("https://billing-application-backend-production.up.railway.app/analysis/todayscustomer");
        const totalAccountantsResponse = await axios.get("https://billing-application-backend-production.up.railway.app/analysis/countAccountant");
        const customerAddedweekResponse = await axios.get("https://billing-application-backend-production.up.railway.app/analysis/weeksCustomer");

        setUserStats({
          totalUsers: totalCustomersResponse.data,
          newUsersToday: customersAddedTodayResponse.data,
          activeUsers: totalAccountantsResponse.data,
          customerAddedweek: customerAddedweekResponse.data
        });

        const usersResponse = await axios.get("https://billing-application-backend-production.up.railway.app/api/users/displayCus");
        setUsers(usersResponse.data);

        const accountantsResponse = await axios.get("https://billing-application-backend-production.up.railway.app/api/admin/displayAcc");
        setAccountants(accountantsResponse.data);
      } catch (error) {
        console.error("There was an error fetching the user stats!", error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (user) => {
    setEditUser(user); // Set the user data to edit
  };

  const handleAccountantEditClick = (accountant) => {
    setEditAccountant(accountant); // Set the accountant data to edit
  };
  // const handleAddCustomerClick = () => {
  //   setShowAddCustomerForm(true);
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAccountantInputChange = (e) => {
    const { name, value } = e.target;
    setEditAccountant((prevAccountant) => ({
      ...prevAccountant,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setEditUser(null); // Close the edit modal for users
    setEditAccountant(null); // Close the edit modal for accountants
    setShowAddCustomerForm(false); // Close the add customer form
    setShowAddAccountantForm(false);
  };

  const handleSaveUser = () => {
    axios
      .put(`https://billing-application-backend-production.up.railway.app/api/users/updateCustomer/${editUser.id}`, editUser)
      .then(() => {
        return axios.get("https://billing-application-backend-production.up.railway.app/api/users/displayCus");
      })
      .then((response) => {
        setUsers(response.data); // Update users state with the fetched data
        setEditUser(null); // Close the edit modal
      })
      .catch((error) => {
        console.error("There was an error updating the user!", error);
      });
  };

  const handleSaveAccountant = () => {
    
    axios
      .put(`https://billing-application-backend-production.up.railway.app/api/admin/updateAccountant/${editAccountant.id}`, editAccountant)
      .then(() => {
        return axios.get("https://billing-application-backend-production.up.railway.app/api/admin/displayAcc");
      })
      .then((response) => {
        setAccountants(response.data); // Update accountants state with the fetched data
        setEditAccountant(null); // Close the edit modal
      })
      .catch((error) => {
        console.error("There was an error updating the accountant!", error);
      });
  };

  const handleAddCustomerClick = () => {
    setShowAddCustomerForm(true);
  };
  const handleAddAccountantClick = () => {
    setShowAddAccountantForm(true);
  };
  const handleInputChangeForNewCustomer = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };
  const handleInputChangeForNewAccountant = (e) => {
    const { name, value } = e.target;
    setNewAccountant((prevAcc) => ({
      ...prevAcc,
      [name]: value,
    }));
  };

  const handleSaveCustomer = () => {
    setError(''); // Reset any previous error state

    axios
      .post("https://billing-application-backend-production.up.railway.app/api/users/createCustomer", newCustomer)
      .then(() => {
        return axios.get("https://billing-application-backend-production.up.railway.app/api/users/displayCus");
      })
      .then((response) => {
        setUsers(response.data); // Update users state with the fetched data
        setShowAddCustomerForm(false); // Close the add customer form
        setNewCustomer({ name: "", email: "", city: "", mobileNumber: "", password: "" }); // Reset the new customer state
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setError("A customer with this email already exists!"); // Update error state
        } else {
          console.error("There was an error adding the customer!", error);
          setError("There was an error adding the customer! Please try again.");
        }
      });
  };
  
  const handleCreateAccountant = async () => {
    try {
      await axios.post("https://billing-application-backend-production.up.railway.app/api/admin/createAccountant", newAccountant);
      // alert("Product added successfully!");
      const response = await axios.get("https://billing-application-backend-production.up.railway.app/api/admin/displayAcc");
      setAccountants(response.data); // Update users state with the fetched data
        setShowAddAccountantForm(false); // Close the add customer form
        setNewAccountant({ name: "", email: "", city: "", mobileNumber: "", password: "" }); // Reset the new product state
    } catch (error) {
      console.error("There was an error adding the accountant!", error);
      alert("There was an error adding the accountant! Please try again.");
    }
  };

  

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Users" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Add Customer Button */}
        

        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Customers"
            icon={UsersIcon}
            value={userStats.totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="Customers Added Today"
            icon={UserPlus}
            value={userStats.newUsersToday}
            color="#10B981"
          />
          <StatCard
            name="Total Accountants"
            icon={UserCheck}
            value={userStats.activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="Weekly Customers Added"
            icon={UserPlus}
            value={userStats.customerAddedweek}
            color="#10B981"
          />
        </motion.div>
        <div>
  {userType === "ROLE_ADMIN" && (
    <>
      <button onClick={handleAddAccountantClick} className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4">
        Add Accountant
      </button>
      <AccountantTable onEditClick={handleAccountantEditClick} onAddCustomerClick={handleAddAccountantClick} />
      <br />
    </>
  )}

  <button onClick={handleAddCustomerClick} className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4">
    Add Customer
  </button>
  
  {userType === "ROLE_ADMIN" || userType === "ROLE_ACCOUNTANT" ? (
    <UsersTable users={users} onEditClick={handleEditClick} onAddCustomerClick={handleAddCustomerClick} />
  ) : null}
</div>

      </main>

      {/* Edit User Form */}
      {editUser && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-100 mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                value={editUser.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">City</label>
              <input
                type="text"
                name="city"
                value={editUser.city}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={editUser.mobileNumber}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              {/* <label className="block text-gray-400">Password</label> */}
              <input
                type="password"
                name="password"
                value={editUser.password}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
                hidden
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleCancel} className="bg-gray-600 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button onClick={handleSaveUser} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Save
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Edit Accountant Form */}
      {editAccountant && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-100 mb-4">Edit Accountant</h2>
            <div className="mb-4">
              <label className="block text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                value={editAccountant.name}
                onChange={handleAccountantInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={editAccountant.email}
                onChange={handleAccountantInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">City</label>
              <input
                type="text"
                name="city"
                value={editAccountant.city}
                onChange={handleAccountantInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-400">Mobile No.</label>
              <input
                type="tel"
                name="mobileNumber"
                value={editAccountant.mobileNumber}
                onChange={handleAccountantInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              {/* <label className="block text-gray-400">Password</label> */}
              <input
                type="password"
                name="password"
                value={editAccountant.password}
                onChange={handleAccountantInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
                readOnly
                hidden
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleCancel} className="bg-gray-600 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button onClick={handleSaveAccountant} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Save
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Customer Form */}
      {showAddCustomerForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-100 mb-4">Add Customer</h2>
            <div className="mb-4">
              <label className="block text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                value={newCustomer.name}
                onChange={handleInputChangeForNewCustomer}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={newCustomer.email}
                onChange={handleInputChangeForNewCustomer}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">City</label>
              <input
                type="text"
                name="city"
                value={newCustomer.city}
                onChange={handleInputChangeForNewCustomer}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={newCustomer.mobileNumber}
                onChange={handleInputChangeForNewCustomer}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Password</label>
              <input
                type="password"
                name="password"
                value={newCustomer.password}
                onChange={handleInputChangeForNewCustomer}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleCancel} className="bg-gray-600 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button onClick={handleSaveCustomer} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Add Customer
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {/* Add Accountant Form */}
      {showAddAccountantForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-100 mb-4">Add Accountant</h2>
            <div className="mb-4">
              <label className="block text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                value={newAccountant.name}
                onChange={handleInputChangeForNewAccountant}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={newAccountant.email}
                onChange={handleInputChangeForNewAccountant}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">City</label>
              <input
                type="text"
                name="city"
                value={newAccountant.city}
                onChange={handleInputChangeForNewAccountant}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={newAccountant.mobileNumber}
                onChange={handleInputChangeForNewAccountant}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400">Password</label>
              <input
                type="password"
                name="password"
                value={newAccountant.password}
                onChange={handleInputChangeForNewAccountant}
                className="w-full bg-gray-700 text-white p-2 rounded-md"
                required
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleCancel} className="bg-gray-600 text-white px-4 py-2 rounded-md mr-2">
                Cancel
              </button>
              <button onClick={handleCreateAccountant} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Add Accountant
              </button>
            </div>
          </div>
        </motion.div>
      )}

          </div>
          
    
  );
};

export default UsersPage;
