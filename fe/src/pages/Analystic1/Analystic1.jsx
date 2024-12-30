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
  TimeScale,
} from "chart.js";
import "chartjs-adapter-luxon";
import { DateTime } from "luxon";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
);

const MAX_TIME_SECONDS = 120;

const App = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Water Altitude (m)",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        cubicInterpolationMode: "monotone",
      },
    ],
  });

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8081/device")
        .then((response) => response.json())
        .then((data) => {
          setDevices(data);
          if (data.length > 0) {
            setSelectedDevice(data[0].id);
          }
        })
        .catch((error) => console.error("Lỗi fetch thiết bị:", error));
  }, []);

  useEffect(() => {
    setChartData({
      labels: [],
      datasets: [
        {
          label: "Water Altitude (m)",
          data: [],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.1)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    });
  }, [selectedDevice]);

  useEffect(() => {
    if (!selectedDevice) return;

    if (socket) {
      socket.close();
    }

    const newSocket = new WebSocket("ws://localhost:8080/ws");

    newSocket.onopen = () => {
      console.log("Kết nối WebSocket thành công");
      newSocket.send(JSON.stringify({ deviceId: selectedDevice }));
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.deviceId === selectedDevice) {
        const altitude = message.altitude;
        const recordTime = new Date(message.recordAt).toISOString();

        setChartData((prevChartData) => {
          const updatedData = [...prevChartData.datasets[0].data];
          const updatedLabels = [...prevChartData.labels];

          updatedData.push(altitude);
          updatedLabels.push(recordTime);

          while (
              updatedLabels.length > 0 &&
              new Date(updatedLabels[0]).getTime() <
              new Date(recordTime).getTime() - MAX_TIME_SECONDS * 1000
              ) {
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
      }
    };

    newSocket.onclose = () => console.log("WebSocket đã đóng");
    newSocket.onerror = (error) => console.error("Lỗi WebSocket:", error);

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [selectedDevice]);

  return (
      <div style={styles.container}>
        {/* Dropdown chọn thiết bị */}
        <div style={styles.selectorContainer}>
          <label htmlFor="deviceSelector" style={styles.selectorLabel}>
            Chọn thiết bị:
          </label>
          <select
              id="deviceSelector"
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              style={styles.selectorDropdown}
          >
            {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {`${device.deviceName} - ${device.location}`}
                </option>
            ))}
          </select>
        </div>

        {/* Biểu đồ */}
        <div style={styles.chartContainer}>
          <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 0,
                },
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
                scales: {
                  x: {
                    type: "time",
                    adapters: {
                      date: {
                        locale: "en-US",
                      },
                    },
                    time: {
                      tooltipFormat: "HH:mm:ss",
                      displayFormats: {
                        second: "HH:mm:ss",
                        minute: "HH:mm",
                      },
                    },
                    ticks: {
                      source: "auto",
                      autoSkip: true,
                      maxTicksLimit: 10,
                    },
                    min: DateTime.now().minus({ seconds: MAX_TIME_SECONDS }).toISO(),
                    max: DateTime.now().toISO(),
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
          />
        </div>
      </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "20px",
  },
  selectorContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  selectorLabel: {
    marginRight: "10px",
  },
  selectorDropdown: {
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ced4da",
  },
  chartContainer: {
    width: "90%",
    height: "70vh",
    margin: "0 auto",
  },
};

export default App;