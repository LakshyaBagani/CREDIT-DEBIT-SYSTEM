import React from "react";
import { MdDelete } from "react-icons/md";

const CustomerList = ({
  filteredCustomers,
  customers,
  searchQuery,
  selectedOption,
  setSelectedCustomer,
  setCustomerTransactions,
  setShowTransactions,
}) => {
  return (
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
                <p className="font-semibold">Customer : {customer.name}</p>
                <p className="text-gray-600">Address : {customer.address}</p>
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
    </div>
  );
};

async function fetchCustomerTransactions(customerName) {
  const customersDocRef = doc(db, "Customers", "allCustomers");
  const docSnap = await getDoc(customersDocRef);

  if (docSnap.exists()) {
    const customers = docSnap.data().customers;
    const customer = customers.find((c) => c.name === customerName);
    return customer ? customer.transactions : [];
  }
  return [];
}

export default CustomerList;