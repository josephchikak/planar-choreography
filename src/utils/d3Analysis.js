import * as d3 from 'd3';

// D3 data analysis utilities for your Airtable data
export const analyzeAirtableData = (airtableData) => {
  if (!airtableData || airtableData.length === 0) {
    return null;
  }

  // Convert Airtable data to D3-friendly format
  const data = airtableData.map(record => ({
    id: record.id,
    ...record.fields
  }));

  // Basic statistics
  const stats = {
    totalRecords: data.length,
    fields: Object.keys(data[0] || {}),
    // Group by different fields
    byCity: d3.group(data, d => d.City),
    byCountry: d3.group(data, d => d.Country),
    byCreation: d3.group(data, d => d.Creation),
    byClosure: d3.group(data, d => d.Closure),
    byCondition: d3.group(data, d => d.Condition),
    byState: d3.group(data, d => d.State)
  };

  // Count unique values for each field
  stats.uniqueCounts = {};
  stats.fields.forEach(field => {
    if (field !== 'id') {
      const uniqueValues = d3.group(data, d => d[field]);
      stats.uniqueCounts[field] = {
        count: uniqueValues.size,
        values: Array.from(uniqueValues.keys()).filter(Boolean)
      };
    }
  });





  // Group data by different fields for visualization
  const groups = {
    city: d3.groups(data, d => d.City),
    country: d3.groups(data, d => d.Country),
    creation: d3.groups(data, d => d.Creation),
    closure: d3.groups(data, d => d.Closure),
    condition: d3.groups(data, d => d.Condition),
    state: d3.groups(data, d => d.State)
  }

 
  return groups;
};

export default {
  analyzeAirtableData,
};
