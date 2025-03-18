import React, { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiSearch } from "react-icons/ci";
import { CiFilter } from "react-icons/ci";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./Database";

function MainPage() {
  const [addCustomer, setAddCustomer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPendingAmount, setCustomerPendingAmount] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [filter, setFilter] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const customersDocRef = doc(db, "Customers", "allCustomers");
      const docSnap = await getDoc(customersDocRef);

      if (docSnap.exists()) {
        setCustomers(docSnap.data().customers);
      }
    };

    fetchCustomers();
  }, []);

  const HandleCrossFilter = () => {
    setFilter(false);
    setSelectedOption([]);
  };

  const HandleAddCustomers = async (e) => {
    e.preventDefault();

    const newCustomer = {
      name: customerName,
      number: customerNumber,
      address: customerAddress,
      pendingAmount: customerPendingAmount,
    };

    try {
      const customersDocRef = doc(db, "Customers", "allCustomers");
      const docSnap = await getDoc(customersDocRef);

      if (docSnap.exists()) {
        const existingCustomers = docSnap.data().customers;
        await updateDoc(customersDocRef, {
          customers: [...existingCustomers, newCustomer],
        });
      } else {
        await setDoc(customersDocRef, { customers: [newCustomer] });
      }

      toast.success(`Customer ${customerName} added successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });

      setAddCustomer(false);
      setCustomerName("");
      setCustomerNumber("");
      setCustomerAddress("");
      setCustomerPendingAmount("");
    } catch (error) {
      toast.error("Error adding customer: " + error.message);
    }
  };

  const HandleCrossButton = () => {
    setAddCustomer(false);
    setCustomerName("");
    setCustomerNumber("");
    setCustomerAddress("");
    setCustomerPendingAmount("");
  };

  const HandleFilterFunction = (e) => {
    e.preventDefault();
    let filtered = customers;

    if (selectedOption.length > 0) {
      filtered = filtered.filter((customer) =>
        selectedOption.includes(customer.address)
      );
    }

    if (searchQuery !== "") {
      filtered = filtered.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);

    if (filtered.length === 0) {
      toast.info("No customers found for the selected filters", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } else {
      toast.success(`Customers filtered successfully`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }

    setFilter(false);
  };

  const HandleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    let filtered = customers;

    if (selectedOption.length > 0) {
      filtered = filtered.filter((customer) =>
        selectedOption.includes(customer.address)
      );
    }

    if (query !== "") {
      filtered = filtered.filter((customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredCustomers(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-gray-100 relative">
      <div>
        <h1 className="text-2xl font-bold text-center">GIRIRAJ AGENCY</h1>
        <ToastContainer />

        <div className="mt-4">
          <div className="flex space-x-10 border-b border-gray-300">
            <button
              className={`pb-2 text-lg font-semibold relative ${
                activeTab === "customers" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("customers")}
            >
              Customers
              {activeTab === "customers" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500" />
              )}
            </button>
            <button
              className={`pb-2 text-lg font-semibold relative ${
                activeTab === "suppliers" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("suppliers")}
            >
              Suppliers
              {activeTab === "suppliers" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 text-center">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">
              You Have To Give It To Supplier
            </h2>
            <h2 className="text-xl font-bold text-red-600">1000</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">
              You Will Get From The Customer
            </h2>
            <h2 className="text-xl font-bold text-green-600">1000</h2>
          </div>
        </div>

        <div className="relative mt-6 flex items-center">
          <div className="relative w-full">
            <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search Customer"
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={searchQuery}
              onChange={HandleSearch}
            />
          </div>
          <div
            className="flex flex-col items-center ml-3 cursor-pointer"
            onClick={() => setFilter(true)}
          >
            <CiFilter className="text-gray-600 text-2xl" />
            <span className="text-xs text-gray-500">Filter</span>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Customer List</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            {(filteredCustomers.length > 0 || searchQuery || selectedOption.length > 0
              ? filteredCustomers
              : customers
            ).length > 0 ? (
              <ul className="space-y-2">
                {(filteredCustomers.length > 0 || searchQuery || selectedOption.length > 0
                  ? filteredCustomers
                  : customers
                ).map((customer, index) => (
                  <li key={index} className="border-b pb-2">
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-gray-600">{customer.number}</p>
                    <p className="text-gray-600">{customer.address}</p>
                    <p className="text-red-600">Pending: ₹{customer.pendingAmount}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No customers found.</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <button
          className="fixed bottom-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600"
          onClick={() => setAddCustomer(true)}
        >
          Add Customer
        </button>
      </div>

      {filter && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[340px] h-[400px] relative">
            <button
              onClick={HandleCrossFilter}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
            >
              <MdCancel />
            </button>

            <h2 className="text-2xl font-semibold mb-6">Filter by Location</h2>

            <div className="flex flex-col space-y-4">
              {["Sausar", "Boargaon", "Lodhikheda", "Satnoor"].map((place) => (
                <label
                  key={place}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    value={place}
                    checked={selectedOption.includes(place)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOption([...selectedOption, place]);
                      } else {
                        setSelectedOption(selectedOption.filter((opt) => opt !== place));
                      }
                    }}
                    className="accent-blue-500"
                  />
                  <span className="text-lg text-gray-700">{place}</span>
                </label>
              ))}
            </div>

            <button
              onClick={HandleFilterFunction}
              className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg text-lg hover:bg-blue-600"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {addCustomer && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={HandleAddCustomers}
            className="bg-white w-[400px] p-8 rounded-xl shadow-2xl relative"
          >
            <button
              className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-800"
              onClick={HandleCrossButton}
              type="button"
            >
              <MdCancel />
            </button>
            <h1 className="text-xl font-semibold mb-4">Customer Name</h1>
            <input
              required
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-4 mb-2">
              Customer Phone Number
            </h2>
            <input
              required
              type="number"
              placeholder="Enter customer number"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-4 mb-2">
              Customer Address
            </h2>
            <input
              required
              type="text"
              placeholder="Enter customer address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-4 mb-2">
              Pending amount
            </h2>
            <input
              required
              type="number"
              placeholder="Enter customer pending amount"
              value={customerPendingAmount}
              onChange={(e) => setCustomerPendingAmount(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 mt-6 rounded-lg text-lg hover:bg-blue-600"
            >
              Add Customer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MainPage;