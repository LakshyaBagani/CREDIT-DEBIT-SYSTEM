import React from "react";
import { MdCancel } from "react-icons/md";

const FilterModal = ({
  filter,
  HandleFilterCross,
  selectedOption,
  setSelectedOption,
  HandleFilterFunction,
}) => {
  if (!filter) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-[100vh] flex flex-col relative max-w-md">
        <button
          onClick={HandleFilterCross}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl"
        >
          <MdCancel />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Filter by Location</h2>
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
        <button
          onClick={HandleFilterFunction}
          className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg hover:bg-blue-600"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterModal;