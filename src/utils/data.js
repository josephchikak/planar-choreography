import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config/airtable';

// Initialize Airtable with your token
const base = new Airtable({
  apiKey: AIRTABLE_CONFIG.apiKey
}).base(AIRTABLE_CONFIG.baseId);

// Single function to fetch data from Airtable
export const fetchAirtableData = async (tableName = AIRTABLE_CONFIG.defaultTable) => {
  try {
    const records = [];
    
    await base(tableName).select({
      // Fetch all fields by default
      view: 'Grid view'
    }).eachPage((pageRecords, fetchNextPage) => {
      pageRecords.forEach(record => {
        records.push({
          id: record.id,
          fields: record.fields
        });
      });
      fetchNextPage();
    });
    
    console.log('Airtable data loaded:');
    // console.log(records.length);
    return records;
  } catch (error) {
    console.error('Error fetching Airtable data:', error);
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error
    });
    return [];
  }
};

export default fetchAirtableData;
