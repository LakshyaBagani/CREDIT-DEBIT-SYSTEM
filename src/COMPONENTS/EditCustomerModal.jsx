import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { db } from "../Database";

const EditCustomerModal = ({
  editCustomer,
  setEditCustomer,
  customers,
  setCustomers,
  setFilteredCustomers,
}) => {
  const [newAddress, setNewAddress] = useState(editCustomer?.address || "");

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    
    try {
      const updatedCustomers = customers.map(customer => 
        customer.name === editCustomer.name 
          ? { ...customer, address: newAddress } 
          : customer
      );

      const customersDocRef = doc(db, "Customers", "allCustomers");
      await updateDoc(customersDocRef, {
        customers: updatedCustomers,
      });

      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      setEditCustomer(null);

      toast.success("Address updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    } catch (error) {
      toast.error("Error updating address: " + error.message);
    }
  };

  if (!editCustomer) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50  bg-opacity-50">
      <div className="bg-white w-[400px] p-8 rounded-xl shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-800"
          onClick={() => setEditCustomer(null)}
          type="button"
        >
          <MdCancel />
        </button>
        <h1 className="text-xl font-semibold mb-4">Edit Customer Address</h1>
        <p className="font-semibold mb-2">Customer: {editCustomer.name}</p>
        <p className="text-gray-600 mb-4">Current Address: {editCustomer.address}</p>
        
        <form onSubmit={handleUpdateAddress}>
          <label className="block text-lg font-semibold mb-2">
            New Address:
          </label>
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg hover:bg-blue-600"
          >
            Update Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerModal;