import React from "react";
import { MdCancel } from "react-icons/md";

const AddCustomerModal = ({
  addCustomer,
  HandleAddCustomerCross,
  HandleAddCustomers,
  customerName,
  setCustomerName,
  customerAddress,
  setCustomerAddress,
  customerPendingAmount,
  setCustomerPendingAmount,
}) => {
  if (!addCustomer) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
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
        <h2 className="text-xl font-semibold mt-4 mb-2">Customer Address</h2>
        <input
          required
          type="text"
          placeholder="Enter customer address"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        <h2 className="text-xl font-semibold mt-4 mb-2">Pending amount</h2>
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
  );
};

export default AddCustomerModal;