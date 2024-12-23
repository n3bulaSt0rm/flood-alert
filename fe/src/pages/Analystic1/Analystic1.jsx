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
    labels: [], // Bắt đầu với nhãn trống
    datasets: [
      {
        label: "Water Altitude (m)",
        data: [], // Bắt đầu với dữ liệu trống
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 0, // Không hiển thị các chấm
        pointHoverRadius: 0, // Không hiển thị hiệu ứng hover
      },
    ],
  });

  useEffect(() => {
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
  }, []);

  return (
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", padding: "20px" }}>
        <div style={styles.chartContainer}>
          <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // Không có hiệu ứng xuất hiện
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                  tooltip: {
                    enabled: true, // Hiển thị tooltip khi di chuột
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
                      autoSkip: true, // Bỏ qua các nhãn trục chồng lấn
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
                      stepSize: 10, // Điều chỉnh khoảng cách giữa các giá trị
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