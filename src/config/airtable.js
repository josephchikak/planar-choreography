// Airtable Configuration
export const AIRTABLE_CONFIG = {
  // Your Airtable token from environment variables
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
  
  // Base ID from environment variables
  // You can find this in your Airtable URL: https://airtable.com/appXXXXXXXXXXXXXX/...
  baseId: import.meta.env.VITE_AIRTABLE_BASE_ID,
  
  // Default table name - you can change this to match your table
  defaultTable:'Dream Palaces',

};

// Helper function to get field name for a group
export const getFieldNameForGroup = (groupIndex) => {
  return AIRTABLE_CONFIG.fieldMappings[`group${groupIndex}`] || `Field ${groupIndex + 1}`;
};

// Helper function to get group name for display
export const getGroupName = (groupIndex) => {
  return AIRTABLE_CONFIG.groupNames[groupIndex] || `Group ${groupIndex}`;
};
