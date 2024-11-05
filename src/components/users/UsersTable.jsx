import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Edit } from "lucide-react";
import axios from "axios";

const UsersTable = ({ onEditClick, onAddCustomer }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8094/api/users/displayCus");
        setUsers(response.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        setError("Failed to fetch users.");
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8094/api/users/deleteCus/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("There was an error deleting the user!", error);
      setError("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );

  const handleAddCustomer = (newCustomer) => {
    setUsers((prevUsers) => [...prevUsers, newCustomer]); 
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Customer</h2>
        <div className="flex items-center space-x-4">
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mobile No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-300">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-100">{user.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.email}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.city}</div>
                  </td>


                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                      {user.mobileNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.createdDate}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2 hover:scale-125 transition-transform duration-200"
                      onClick={() => onEditClick(user)}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 hover:scale-125 transition-transform duration-200"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {error && <p className="text-red-500">{error}</p>} 
    </motion.div>
  );
};

export default UsersTable;
