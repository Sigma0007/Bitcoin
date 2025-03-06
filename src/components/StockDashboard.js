import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchStockData } from "../services/stockService";

const StockDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);

  const updateData = async () => {
    try {
      setLoading(true);
      setError(null);
      const bitcoinData = await fetchStockData();
      setPrice(bitcoinData.usd);
      setChange(bitcoinData.usd_24h_change);

      // Add new price point to the graph data
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        price: bitcoinData.usd
      };

      setData(prevData => {
        const updatedData = [...prevData, newDataPoint];
        // Keep only last 24 data points
        return updatedData.slice(-24);
      });
    } catch (err) {
      setError("Failed to fetch Bitcoin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading && data.length === 0)
    return <div className="text-white text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-900 rounded-lg shadow-xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-white">Bitcoin Price Analytics</h1>
        <div className="px-4 py-2 bg-gray-800 rounded-full">
          <span className="text-sm text-gray-300">⏱ Last 24 Hours</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-6 bg-gray-800 rounded-lg transform transition duration-200 hover:scale-105">
          <p className="text-sm uppercase text-gray-400 font-semibold mb-2">Current Price</p>
          <p className="flex items-baseline text-white text-3xl font-bold">
            <span className="text-gray-400 text-xl mr-1">$</span>
            {price?.toLocaleString()}
            <span className="text-gray-400 text-lg ml-1">USD</span>
          </p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg transform transition duration-200 hover:scale-105">
          <p className="text-sm uppercase text-gray-400 font-semibold mb-2">24h Change</p>
          <p
            className={`flex items-baseline text-3xl font-bold ${
              change >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {change >= 0 ? "↑" : "↓"} {Math.abs(change?.toFixed(2))}
            <span className="text-lg ml-1">%</span>
          </p>
        </div>
      </div>
      <div className="p-4 bg-gray-800 rounded-lg">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
            />
            <YAxis
              dataKey="price"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
              domain={["dataMin", "dataMax"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#4B5563",
                border: "none",
                borderRadius: "0.5rem",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockDashboard;
