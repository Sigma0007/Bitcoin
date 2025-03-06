import axios from "axios";

export const fetchStockData = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
    );
    
    if (!response.data.bitcoin) {
      throw new Error("Invalid API response");
    }

    return response.data.bitcoin;
  } catch (error) {
    console.error("Error fetching bitcoin data:", error);
    throw error;
  }
};