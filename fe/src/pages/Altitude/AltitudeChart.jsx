import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";
import { getDevices } from "../Altitude/deviceApi";
import { getWaterLevelData } from "../Altitude/waterLevelApi";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: "black",
    boxShadow: state.isFocused ? "0 0 0 1px blue" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "blue" : "darkgray",
    },
    borderRadius: "8px",
    padding: "2px",
    width: "200px",
  }),
};

const AltitudeChart = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [options, setOptions] = useState([]);
  const [chartData, setChartData] = useState(null);

  // Fetch devices for dropdown
  useEffect(() => {
    const fetchDevices = async () => {
      const devices = await getDevices();
      setOptions(
        devices.map((device) => ({
          value: device.id,
          label: device.location.name ?? device.embedId,
        }))
      );
    };
    fetchDevices();
  }, []);

  const handleOnSubmit = async () => {
    if (!selectedDevice) {
      alert("Please select a device!");
      return;
    }

    // Fetch water level data
    const data = await getWaterLevelData(
      selectedDevice.value,
      moment(startDate).format("YYYY-MM-DD")
    );

    // Process data for chart
    const chartData = {
      labels: data.map((entry) => entry.time), // Array of time (minutes)
      datasets: [
        {
          label: "Water Level (m)",
          data: data.map((entry) => entry.waterLevel),
          borderColor: "blue",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
        },
      ],
    };
    setChartData(chartData);
  };

  return (
    <div className="p-4">
      {/* Line 1: Filters */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        <Select
          value={selectedDevice}
          onChange={setSelectedDevice}
          options={options}
          styles={customStyles}
          placeholder="Select device"
        />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-400 rounded p-2"
        />
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={handleOnSubmit}
        >
          Submit
        </button>
      </div>

      {/* Line 2: Chart */}
      <div className="h-[70vh] w-full">
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Water Level Over Time" },
              },
              scales: {
                x: { title: { display: true, text: "Time (Minutes)" } },
                y: { title: { display: true, text: "Water Level (m)" } },
              },
            }}
          />
        ) : (
          <p className="text-center text-gray-500">No data to display</p>
        )}
      </div>
    </div>
  );
};

export default AltitudeChart;
