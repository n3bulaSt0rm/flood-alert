import React, { useEffect, useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MAX_TIME_SECONDS = 300; // Hiển thị 5 phút dữ liệu (300 giây)

const App = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Water Altitude (m)",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  });

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    // Fetch danh sách thiết bị từ API
    fetch("http://localhost:8081/device")
      .then((response) => response.json())
      .then((data) => {
        setDevices(data);
        if (data.length > 0) {
          setSelectedDevice(data[0].deviceName); 
        }
      })
      .catch((error) => console.error("Error fetching devices:", error));
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;

    const socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const altitude = message.altitude; // Giá trị độ cao nước
      const currentTime = new Date().toLocaleTimeString(); // Nhãn thời gian hiện tại

      setChartData((prevChartData) => {
        const updatedData = [...prevChartData.datasets[0].data];
        const updatedLabels = [...prevChartData.labels];

        // Thêm dữ liệu mới
        updatedData.push(altitude);
        updatedLabels.push(currentTime);

        // Giữ dữ liệu trong giới hạn MAX_TIME_SECONDS
        if (updatedData.length > MAX_TIME_SECONDS) {
          updatedData.shift();
          updatedLabels.shift();
        }

        return {
          ...prevChartData,
          labels: updatedLabels,
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: updatedData,
            },
          ],
        };
      });
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close(); // Dọn dẹp kết nối WebSocket
    };
  }, [selectedDevice]);

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={styles.selectorContainer}>
        <label htmlFor="deviceSelector" style={styles.selectorLabel}>
          Select Device:
        </label>
        <select
          id="deviceSelector"
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          style={styles.selectorDropdown}
        >
          {devices.map((device) => (
            <option key={device.deviceName} value={device.deviceName}>
              {`${device.deviceName} - ${device.location}`}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.chartContainer}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: (context) => `Altitude: ${context.raw} m`,
                },
              },
              title: {
                display: true,
                text: "Real-Time Water Altitude (m)",
                font: {
                  size: 18,
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time (hh:mm:ss)",
                  font: {
                    size: 14,
                  },
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10,
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Altitude (m)",
                  font: {
                    size: 14,
                  },
                },
                beginAtZero: true,
                ticks: {
                  stepSize: 10,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  selectorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  selectorLabel: {
    fontSize: "16px",
    fontWeight: "bold",
    marginRight: "10px",
  },
  selectorDropdown: {
    padding: "8px 12px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ced4da",
    outline: "none",
    cursor: "pointer",
    transition: "border-color 0.2s ease-in-out",
    width: "300px", // Điều chỉnh độ dài
  },
  chartContainer: {
    width: "98%",
    margin: "0 auto",
    height: "70vh",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default App;
