import React from "react";
import { MdCancel, MdDelete } from "react-icons/md";

const TransactionsModal = ({
  showTransactions,
  setShowTransactions,
  selectedCustomer,
  creditDebitAmount,
  setCreditDebitAmount,
  HandleCredit,
  HandleDebit,
  customerTransactions,
  confirmDeleteTransaction,
}) => {
  if (!showTransactions) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] h-[100vh] p-8 rounded-xl shadow-2xl relative flex flex-col">
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
                      <p className="text-gray-600">Date: {transaction.date}</p>
                    </li>
                  ))}
              </ul>
            </div>
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
                      <p className="text-gray-600">Date: {transaction.date}</p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsModal;