import React from "react";
import { AIRTABLE_CONFIG } from "../config/airtable";
import { useStore } from "../utils/useStore";


const Filter = ({}) => {
  const { data, filters, clearFilters, updateFilters } = useStore();
  if (!data) return null;

  // console.log(originalData)
  const handleFilterChange = (field, value) => {
    if (value === "clear") {
      clearFilters();
    } else {
      updateFilters(field, value);
    }
  };

  //get values for each field
  const getFieldValues = (field) => {
    const fields = new Set();
    data.forEach((record) => {
      if (record.fields[field]) {
        const normalizedField = record.fields[field].toString().trim();
        fields.add(normalizedField);
      }
    });
    return Array.from(fields).sort();
  };

  if (!filters) return null;
  const fieldNames = Object.keys(filters);

  return (
    <div
      className="flex flex-col font-inter gap-4 w-1/6 h-[100vh] justify-start items-center bg-black z-50 p-4"
      pointerEvents="auto"
    >
      <h2 className="text-white text-xs text-center">Filter cinemas</h2>
      <div className="flex flex-col w-full h-full">
        {fieldNames.map((field) => (
          <div
            key={field}
            className="mb-4 flex flex-row gap-4 justify-center  w-full h-[5vh]"
          >
            {/* <label htmlFor={field} className='text-white text-xs text-center'>
                    {field}
                </label> */}

            <select
              className="p-2 m-2 bg-slate-900 cursor-pointer text-white bg-opacity-20 w-full text-xs text-center"
              value={filters[field] || "all"}
              onChange={(e) => handleFilterChange(field, e.target.value)}
            >
              <option value="all"> {field}</option>
              {getFieldValues(field).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        className=" mt-4 bg-slate-900 bg-opacity-50 text-white text-xs px-4 py-2 rounded pointer"
        onClick={() => handleFilterChange("clear", "all")}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filter;
