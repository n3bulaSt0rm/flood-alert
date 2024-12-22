#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>

const char* ssid = "TDuong";
const char* password = "lmaoezzz";

const char* mqtt_server = "broker.emqx.io";
const char *mqtt_username = "admin";
const char *mqtt_password = "Duong1q2w3e4r";
const char* topic = "flood";
const int mqtt_port = 1883;
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 25200; // GMT+7
const int   daylightOffset_sec = 0;

const int trig = 5;
const int echo = 18;
const char* deviceId = "device-001";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(9600);
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  Serial.println("Configuring time...");
  delay(2000); // Wait for time to be set

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
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }
  char timeStr[30];
  strftime(timeStr, sizeof(timeStr), "%Y-%m-%dT%H:%M:%S%z", &timeinfo);

  String message = "{\"deviceId\": \"" + String(deviceId) + "\", \"altitude\": " + String(distance) + ", \"time\": \"" + String(timeStr) + "\"}";
  char buffer[message.length() + 1];
  message.toCharArray(buffer, message.length() + 1);

  Serial.println("Đang gửi dữ liệu đến MQTT...");
  client.publish(topic, buffer);
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client", mqtt_username, mqtt_password)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}