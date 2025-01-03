#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>

const char* ssid = "TDuong";
const char* password = "lmaoezzz";

const char* mqtt_server = "broker.emqx.io";
const char *mqtt_username = "admin";
const char *mqtt_password = "1qazxsw2!@";
const char* topic = "12345";
const int mqtt_port = 1883;
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 25200; // GMT+7
const int   daylightOffset_sec = 0;

const int trig = 5;
const int echo = 18;
const char* deviceId = "12345";

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
  delay(1000); // Wait for time to be set

  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int distance = measureDistance();
  sendMQTT(distance);

  delay(1000);
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
  time_t now;
  int retryCount = 0;
  const int maxRetries = 5;

  while ((now = time(nullptr)) == -1 && retryCount < maxRetries) {
    Serial.println("Failed to obtain time, retrying...");
    delay(1000); // Wait before retrying
    retryCount++;
  }

  if (retryCount == maxRetries) {
    Serial.println("Failed to obtain time after maximum retries");
    return;
  }

  String message = "{\"DeviceID\": \"" + String(deviceId) + "\", \"Altitude\": " + String(distance) + ", \"RecordAt\": " + String(now) + "}";
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