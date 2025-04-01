import React, { useState, useEffect } from "react";
import { MdCancel, MdDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiSearch, CiFilter } from "react-icons/ci";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./Database";

function MainPage() {
  const [addCustomer, setAddCustomer] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPendingAmount, setCustomerPendingAmount] = useState("");
  const [activeTab, setActiveTab] = useState("customers");
  const [filter, setFilter] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [creditDebitAmount, setCreditDebitAmount] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [supplier, setSupplier] = useState(false);
  const [amountFromCustomers, setAmountFromCustomers] = useState(0);
  const [amountFromSupplier, setAmountFromSupplier] = useState(0);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Fetch customers from Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersDocRef = doc(db, "Customers", "allCustomers");
        const docSnap = await getDoc(customersDocRef);

        if (docSnap.exists()) {
          const customersData = docSnap.data().customers || [];
          setCustomers(customersData);
          setFilteredCustomers(customersData);
        } else {
          setCustomers([]);
          setFilteredCustomers([]);
        }
      } catch (error) {
        toast.error("Error fetching customers: " + error.message);
        setCustomers([]);
        setFilteredCustomers([]);
      }
    };

    fetchCustomers();
  }, []);

  // Calculate total pending amount whenever customers change
  useEffect(() => {
    const totalPendingAmount = customers.reduce((sum, customer) => {
      return sum + parseFloat(customer.pendingAmount || 0);
    }, 0);
    setAmountFromCustomers(totalPendingAmount);
  }, [customers]);

  const HandleAddCustomers = async (e) => {
    e.preventDefault();
    setAddCustomer(false);

    const timestamp = Date.now();
    const currentDate = new Date(timestamp);
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const date = `${day}/${month}/${year}`;

    const newCustomer = {
      name: customerName,
      address: customerAddress,
      pendingAmount: customerPendingAmount,
      transactions: [
        {
          type: "credit",
          amount: customerPendingAmount,
          date: date,
        },
      ],
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

      setCustomerName("");
      setCustomerAddress("");
      setCustomerPendingAmount("");

      const updatedDocSnap = await getDoc(customersDocRef);
      if (updatedDocSnap.exists()) {
        setCustomers(updatedDocSnap.data().customers);
        setFilteredCustomers(updatedDocSnap.data().customers);
      }
    } catch (error) {
      toast.error("Error adding customer: " + error.message);
    }
  };

  const HandleAddCustomerCross = () => {
    setAddCustomer(false);
    setCustomerName("");
    setCustomerAddress("");
    setCustomerPendingAmount("");
  };

  const fetchCustomerTransactions = async (customerName) => {
    const customersDocRef = doc(db, "Customers", "allCustomers");
    const docSnap = await getDoc(customersDocRef);

    if (docSnap.exists()) {
      const customers = docSnap.data().customers;
      const customer = customers.find((c) => c.name === customerName);
      return customer ? customer.transactions : [];
    }
    return [];
  };

  const HandleCredit = async (e) => {
    e.preventDefault();
    setShowTransactions(false);

    if (!selectedCustomer || !creditDebitAmount) {
      toast.error("Please select a customer and enter an amount.");
      return;
    }

    try {
      const amount = parseFloat(selectedCustomer.pendingAmount);
      const creditAmount = parseFloat(creditDebitAmount);
      const newAmount = amount + creditAmount;

      const timestamp = Date.now();
      const currentDate = new Date(timestamp);
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = currentDate.getFullYear();
      const date = `${day}/${month}/${year}`;

      const newTransaction = {
        type: "credit",
        amount: creditDebitAmount,
        date: date,
      };

      const updatedCustomers = customers.map((customer) =>
        customer.name === selectedCustomer.name
          ? {
              ...customer,
              pendingAmount: newAmount.toString(),
              transactions: [...customer.transactions, newTransaction],
            }
          : customer
      );

      const customersDocRef = doc(db, "Customers", "allCustomers");
      await updateDoc(customersDocRef, {
        customers: updatedCustomers,
      });

      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);

      toast.success(`Updated pending amount for ${selectedCustomer.name}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });

      setCreditDebitAmount("");
      setSelectedCustomer(null);
    } catch (error) {
      toast.error("Error updating customer: " + error.message);
    }
  };

  const HandleDebit = async (e) => {
    e.preventDefault();
    setShowTransactions(false);

    if (!selectedCustomer || !creditDebitAmount) {
      toast.error("Please select a customer and enter an amount.");
      return;
    }

    try {
      const amount = parseFloat(selectedCustomer.pendingAmount);
      const debitAmount = parseFloat(creditDebitAmount);
      const newAmount = amount - debitAmount;

      const timestamp = Date.now();
      const currentDate = new Date(timestamp);
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = currentDate.getFullYear();
      const date = `${day}/${month}/${year}`;

      const newTransaction = {
        type: "debit",
        amount: creditDebitAmount,
        date: date,
      };

      const updatedCustomers = customers.map((customer) =>
        customer.name === selectedCustomer.name
          ? {
              ...customer,
              pendingAmount: newAmount.toString(),
              transactions: [...customer.transactions, newTransaction],
            }
          : customer
      );

      const customersDocRef = doc(db, "Customers", "allCustomers");
      await updateDoc(customersDocRef, {
        customers: updatedCustomers,
      });

      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);

      toast.success(`Updated pending amount for ${selectedCustomer.name}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });

      setCreditDebitAmount("");
      setSelectedCustomer(null);
    } catch (error) {
      toast.error("Error updating customer: " + error.message);
    }
  };

  const confirmDeleteTransaction = (transactionIndex, transactionType) => {
    // Find the actual index in the full transactions array
    let actualIndex;
    if (transactionType === "credit") {
      const creditTransactions = customerTransactions.filter(t => t.type === "credit");
      actualIndex = customerTransactions.findIndex((t, idx) => 
        t.type === "credit" && 
        creditTransactions.findIndex(ct => ct === t) === transactionIndex
      );
    } else {
      const debitTransactions = customerTransactions.filter(t => t.type === "debit");
      actualIndex = customerTransactions.findIndex((t, idx) => 
        t.type === "debit" && 
        debitTransactions.findIndex(dt => dt === t) === transactionIndex
      );
    }
    
    setTransactionToDelete(actualIndex);
  };

  const deleteTransaction = async () => {
    if (!selectedCustomer || transactionToDelete === null) return;

    try {
      const updatedCustomers = customers.map((customer) => {
        if (customer.name === selectedCustomer.name) {
          // Create a new array without the deleted transaction
          const updatedTransactions = [
            ...customer.transactions.slice(0, transactionToDelete),
            ...customer.transactions.slice(transactionToDelete + 1)
          ];

          // Recalculate the pending amount based on remaining transactions
          let newPendingAmount = 0;
          updatedTransactions.forEach((transaction) => {
            if (transaction.type === "credit") {
              newPendingAmount += parseFloat(transaction.amount);
            } else if (transaction.type === "debit") {
              newPendingAmount -= parseFloat(transaction.amount);
            }
          });

          return {
            ...customer,
            pendingAmount: newPendingAmount.toString(),
            transactions: updatedTransactions,
          };
        }
        return customer;
      });

      const customersDocRef = doc(db, "Customers", "allCustomers");
      await updateDoc(customersDocRef, {
        customers: updatedCustomers,
      });

      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);

      // Update the selected customer and transactions
      const updatedCustomer = updatedCustomers.find(
        (c) => c.name === selectedCustomer.name
      );
      setSelectedCustomer(updatedCustomer);
      setCustomerTransactions(updatedCustomer.transactions);
      setTransactionToDelete(null);

      toast.success("Transaction deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (error) {
      toast.error("Error deleting transaction: " + error.message);
      setTransactionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTransactionToDelete(null);
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

  const HandleFilterCross = () => {
    setFilter(false);
    setSelectedOption([]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-gray-100 relative">
      <div>
        <h1 className="text-2xl font-bold text-center">GIRIRAJ AGENCY</h1>
        <ToastContainer />

        {/* Tabs for Customers and Suppliers */}
        <div className="mt-4">
          <div className="flex space-x-10 border-b border-gray-300">
            <button
              className={`pb-2 text-lg font-semibold relative ${
                activeTab === "customers" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => {
                setActiveTab("customers");
                setSupplier(false);
              }}
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
              onClick={() => {
                setActiveTab("suppliers");
                setSupplier(true);
              }}
            >
              Suppliers
              {activeTab === "suppliers" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500" />
              )}
            </button>
          </div>
        </div>

        {/* Cards for Supplier and Customer Amounts */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-center">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">
              You Will Get From The Customer
            </h2>
            <h2 className="text-xl font-bold text-green-600">
              ₹{amountFromCustomers.toFixed(2)}
            </h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">
              You Have To Give It To Supplier
            </h2>
            <h2 className="text-xl font-bold text-red-600">
              ₹{amountFromSupplier.toFixed(2)}
            </h2>
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

        {/* Customer List */}
        {!supplier && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Customer List</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              {(filteredCustomers.length > 0 ||
              searchQuery ||
              selectedOption.length > 0
                ? filteredCustomers
                : customers
              ).length > 0 ? (
                <ul className="space-y-2">
                  {(filteredCustomers.length > 0 ||
                  searchQuery ||
                  selectedOption.length > 0
                    ? filteredCustomers
                    : customers
                  ).map((customer, index) => (
                    <li
                      key={index}
                      className="border-b pb-2 cursor-pointer"
                      onClick={async () => {
                        setSelectedCustomer(customer);
                        const transactions = await fetchCustomerTransactions(
                          customer.name
                        );
                        setCustomerTransactions(transactions);
                        setShowTransactions(true);
                      }}
                    >
                      <p className="font-semibold">
                        Customer : {customer.name}
                      </p>
                      <p className="text-gray-600">
                        Address : {customer.address}
                      </p>
                      <p className="text-red-600">
                        Pending: ₹{customer.pendingAmount}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No customers found.</p>
              )}
            </div>

            <div>
              <button
                className="fixed bottom-6 right-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600"
                onClick={() => setAddCustomer(true)}
              >
                Add Customer
              </button>
            </div>
          </div>
        )}

        {/* Add Customer Modal */}
        {addCustomer && (
          <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
            <form
              onSubmit={HandleAddCustomers}
              className="bg-white w-[400px] p-8 rounded-xl shadow-2xl relative"
            >
              <button
                className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-800"
                onClick={HandleAddCustomerCross}
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

        {/* Transactions Modal */}
        {showTransactions && (
          <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-[400px] h-[100vh] p-8 rounded-xl shadow-2xl relative flex flex-col">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-800"
                onClick={() => setShowTransactions(false)}
                type="button"
              >
                <MdCancel />
              </button>
              <h1 className="text-xl font-semibold mb-4">
                Transactions for {selectedCustomer?.name}
              </h1>
              <p className="text-xl font-semibold mb-4">
                Pending Amount: ₹{selectedCustomer?.pendingAmount}
              </p>
              <input
                required
                type="number"
                placeholder="Enter amount"
                value={creditDebitAmount}
                onChange={(e) => setCreditDebitAmount(e.target.value)}
                className="w-full p-3 border rounded-lg mb-4"
              />
              <div className="flex space-x-4 mb-4">
                <button
                  className="w-full bg-green-500 text-white py-2 rounded-lg text-lg hover:bg-green-600"
                  onClick={HandleCredit}
                >
                  CREDIT
                </button>
                <button
                  className="w-full bg-red-500 text-white py-2 rounded-lg text-lg hover:bg-red-600"
                  onClick={HandleDebit}
                >
                  DEBIT
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Credit Transactions Column */}
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-green-600">
                      Credit Transactions
                    </h2>
                    <ul className="space-y-2">
                      {customerTransactions
                        .filter((transaction) => transaction.type === "credit")
                        .map((transaction, index) => (
                          <li key={index} className="border-b pb-2 relative">
                            <button
                              onClick={() => confirmDeleteTransaction(index, "credit")}
                              className="absolute right-0 top-0 text-red-500 hover:text-red-700"
                            >
                              <MdDelete />
                            </button>
                            <p className="font-semibold">CREDIT</p>
                            <p className="text-gray-600">
                              Amount: ₹{transaction.amount}
                            </p>
                            <p className="text-gray-600">
                              Date: {transaction.date}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Debit Transactions Column */}
                  <div>
                    <h2 className="text-lg font-semibold mb-2 text-red-600">
                      Debit Transactions
                    </h2>
                    <ul className="space-y-2">
                      {customerTransactions
                        .filter((transaction) => transaction.type === "debit")
                        .map((transaction, index) => (
                          <li key={index} className="border-b pb-2 relative">
                            <button
                              onClick={() => confirmDeleteTransaction(index, "debit")}
                              className="absolute right-0 top-0 text-red-500 hover:text-red-700"
                            >
                              <MdDelete />
                            </button>
                            <p className="font-semibold">DEBIT</p>
                            <p className="text-gray-600">
                              Amount: ₹{transaction.amount}
                            </p>
                            <p className="text-gray-600">
                              Date: {transaction.date}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {transactionToDelete !== null && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="mb-6">Are you sure you want to delete this transaction?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTransaction}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {filter && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[100vh] flex flex-col relative max-w-md">
              {/* Close Button */}
              <button
                onClick={HandleFilterCross}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
              >
                <MdCancel />
              </button>

              {/* Modal Title */}
              <h2 className="text-2xl font-semibold mb-4">
                Filter by Location
              </h2>
              <div className="flex-1 overflow-y-auto mb-4">
                <div className="flex flex-col space-y-1">
                  {[
                    "Sausar",
                    "Boargaon",
                    "Lodhikheda",
                    "Satnoor",
                    "Pipla",
                    "Mohgaon",
                    "Pamdrakhedhi",
                  ].map((place) => (
                    <label
                      key={place}
                      className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        value={place}
                        checked={selectedOption.includes(place)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOption([...selectedOption, place]);
                          } else {
                            setSelectedOption(
                              selectedOption.filter((opt) => opt !== place)
                            );
                          }
                        }}
                        className="accent-blue-500"
                      />
                      <span className="text-lg text-gray-700">{place}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={HandleFilterFunction}
                className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;