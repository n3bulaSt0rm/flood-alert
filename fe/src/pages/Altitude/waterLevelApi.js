export const getWaterLevelData = async (deviceId, date) => {
  console.log(`Fetching water level for device ${deviceId} on date ${date}`);

  // Dữ liệu cố định cho một số ngày
  const mockDataByDate = {
    "2024-12-01": Array.from({ length: 144 }, (_, i) => ({
      time: `${String(Math.floor(i / 6)).padStart(2, "0")}:${String(
        (i % 6) * 10
      ).padStart(2, "0")}`,
      waterLevel: Math.random() * 2 + deviceId * 0.5, // Mực nước thay đổi theo thiết bị
    })),
    "2024-12-02": Array.from({ length: 144 }, (_, i) => ({
      time: `${String(Math.floor(i / 6)).padStart(2, "0")}:${String(
        (i % 6) * 10
      ).padStart(2, "0")}`,
      waterLevel: Math.random() * 3 + deviceId * 0.3, // Mực nước thấp hơn
    })),
    "2024-12-03": Array.from({ length: 144 }, (_, i) => ({
      time: `${String(Math.floor(i / 6)).padStart(2, "0")}:${String(
        (i % 6) * 10
      ).padStart(2, "0")}`,
      waterLevel: Math.random() * 5 + deviceId * 0.7, // Mực nước cao hơn
    })),
  };

  // Trả về dữ liệu nếu ngày có trong mockDataByDate
  if (mockDataByDate[date]) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDataByDate[date]), 500); // Giả lập độ trễ 0.5 giây
    });
  }

  // Nếu ngày không có trong mockDataByDate, trả về rỗng
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 500); // Trả về danh sách rỗng
  });
};
