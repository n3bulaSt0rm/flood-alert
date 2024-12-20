#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "lagvl";
const char* password = "dangkimadung";
const char* mqtt_server = "broker.hivemq.com";
const char* topic = "flood";
const int mqtt_port = 1883;

const int trig = 5;
const int echo = 18;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(9600);
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);

  Serial.println("Kết nối WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi đã kết nối!");
  Serial.print("Địa chỉ IP: ");
  Serial.println(WiFi.localIP());

  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int distance = measureDistance();
  sendMQTT(distance);

  delay(2000);
}

int measureDistance() {
  unsigned long duration;
  int distance;

  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  duration = pulseIn(echo, HIGH);

  distance = int(duration / 2 / 29.412);

  Serial.print("Khoảng cách: ");
  Serial.print(distance);
  Serial.println(" cm");
  return distance;
}

void sendMQTT(int distance) {
  // Tạo chuỗi JSON để gửi dữ liệu
  String message = "{\"distance\": " + String(distance) + "}";
  char buffer[message.length() + 1];
  message.toCharArray(buffer, message.length() + 1);

  // Gửi dữ liệu đến topic MQTT
  Serial.println("Đang gửi dữ liệu đến MQTT...");
  if (client.publish(topic, buffer)) {
    Serial.println("Gửi dữ liệu thành công!");
  } else {
    Serial.println("Gửi dữ liệu thất bại!");
  }
}

// Hàm kết nối lại MQTT broker
void reconnect() {
  // Kết nối lại MQTT broker nếu bị mất kết nối
  while (!client.connected()) {
    Serial.println("Đang kết nối đến MQTT...");
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    client_id += String(random(0xffff), HEX);
    if (client.connect(client_id.c_str())) {
      Serial.println("Kết nối MQTT thành công!");
    } else {
      Serial.print("Kết nối MQTT thất bại, trạng thái: ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}