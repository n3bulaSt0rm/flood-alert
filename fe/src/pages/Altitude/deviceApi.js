export const getDevices = async () => {
  console.log("Fetching devices...");

  // Dữ liệu giả lập
  const mockDevices = [
    { id: 1, location: { name: "Device 1" }, embedId: "D1" },
    { id: 2, location: { name: "Device 2" }, embedId: "D2" },
    { id: 3, location: { name: "Device 3" }, embedId: "D3" },
  ];

  // Trả về dữ liệu giả lập
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDevices), 500); // Giả lập độ trễ 0.5 giây
  });
};
