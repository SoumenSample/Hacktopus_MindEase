#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <Wire.h>
#include "MAX30105.h"
#include <time.h>

// Supabase Config
const char* ssid = "wifi name";
const char* password = "wifi password";
const char* supabaseUrl = "your url";
const char* supabaseKey = "youe key";
const char* tableEndpoint = "/rest/v1/biometrics";
const char* contentType = "application/json";

// Sensor Pins
#define GSR_PIN        32
#define ONE_WIRE_BUS   33
#define DHT_PIN        19
#define DHT_TYPE       DHT22
#define LED_GREEN      12
#define LED_RED        14
#define CONNECTION_LED 2  // Built-in LED for connection status

// GSR Parameters
#define GSR_MIN        0       // Minimum expected raw GSR value
#define GSR_MAX        4095    // Maximum expected raw GSR value (for ESP32's 12-bit ADC)
#define GSR_OUT_MIN    0       // Desired minimum output value
#define GSR_OUT_MAX    100     // Desired maximum output value

// Stress Detection Parameters
#define GSR_THRESHOLD      70      // Normalized threshold (0-100)
#define GSR_WEIGHT         0.3f
#define HR_THRESHOLD       80      // BPM
#define HR_WEIGHT          0.25f
#define TEMP_THRESHOLD     37.2f   // °C
#define TEMP_WEIGHT        0.2f
#define SPO2_THRESHOLD     95      // %
#define SPO2_WEIGHT        0.25f

// Normalization factors
#define GSR_NORMAL         50.0f   // Normalized baseline (0-100)
#define HR_NORMAL          72.0f
#define TEMP_NORMAL        36.5f
#define SPO2_NORMAL        98.0f

// Headband connection monitoring
#define CONNECTION_TIMEOUT 30000  // 30 seconds
unsigned long lastDataTime = 0;
bool headbandConnected = true;

// Setup sensor instances
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature bodyTempSensor(&oneWire);
DHT dht(DHT_PIN, DHT_TYPE);
MAX30105 particleSensor;

// Variables for moving average
#define STRESS_WINDOW_SIZE 5
float stressHistory[STRESS_WINDOW_SIZE];
int stressIndex = 0;
unsigned long lastLEDToggle = 0;

void setup() {
  Serial.begin(115200);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(CONNECTION_LED, OUTPUT);

  // Initialize stress history
  for (int i = 0; i < STRESS_WINDOW_SIZE; i++) {
    stressHistory[i] = 0.0f;
  }

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  // Initialize sensors
  dht.begin();
  bodyTempSensor.begin();
  Wire.begin(5, 4);  // SDA = 5, SCL = 4
  if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
    Serial.println("MAX30102 not found");
    while (1);
  }
  particleSensor.setup();

  // Configure time
  configTime(0, 0, "pool.ntp.org");
}

float normalizeGSR(float rawGSR) {
  // Constrain the raw value to expected range
  rawGSR = constrain(rawGSR, GSR_MIN, GSR_MAX);
  // Map to 0-100 range
  return map(rawGSR, GSR_MIN, GSR_MAX, GSR_OUT_MIN, GSR_OUT_MAX);
}

float calculateStressScore(float gsr, int heartRate, int spo2, float temperature) {
    // Calculate normalized deviations from baseline
    float gsrFactor = max(0.0f, gsr - GSR_NORMAL) / (GSR_THRESHOLD - GSR_NORMAL);
    float hrFactor = max(0.0f, (float)heartRate - HR_NORMAL) / (HR_THRESHOLD - HR_NORMAL);
    float tempFactor = max(0.0f, temperature - TEMP_NORMAL) / (TEMP_THRESHOLD - TEMP_NORMAL);
    float spo2Factor = max(0.0f, SPO2_NORMAL - (float)spo2) / (SPO2_NORMAL - SPO2_THRESHOLD);
    
    // Calculate weighted stress score
    return (gsrFactor * GSR_WEIGHT) +
           (hrFactor * HR_WEIGHT) +
           (tempFactor * TEMP_WEIGHT) +
           (spo2Factor * SPO2_WEIGHT);
}

void updateLEDs(float stressScore) {
    // Turn off both LEDs first
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_RED, LOW);
    
    if (stressScore < 0.3f) {
        // Low stress - solid green
        digitalWrite(LED_GREEN, HIGH);
    } 
    else if (stressScore < 0.7f) {
        // Moderate stress - blinking green
        if (millis() - lastLEDToggle > 500) {
            digitalWrite(LED_GREEN, !digitalRead(LED_GREEN));
            lastLEDToggle = millis();
        }
    }
    else {
        // High stress - solid red
        digitalWrite(LED_RED, HIGH);
    }
}

void sendToSupabase(float rawGSR, float gsr, int heartRate, int spo2, float temperature, float stressScore, bool connected) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(supabaseUrl) + tableEndpoint;
    http.begin(url);
    http.addHeader("apikey", supabaseKey);
    http.addHeader("Authorization", String("Bearer ") + supabaseKey);
    http.addHeader("Content-Type", contentType);
    http.addHeader("Prefer", "resolution=merge-duplicates");

    // Get current timestamp
    struct tm timeinfo;
    String timestamp = "";
    if(getLocalTime(&timeinfo)){
      char timeStr[25];
      strftime(timeStr, sizeof(timeStr), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
      timestamp = String(timeStr);
    }

    // Create payload
    String payload = "[{";
    payload += "\"user_id\":\"74acc9e1-3900-46d8-a7b8-4e385dbe08b7\",";
    payload += "\"recorded_at\":\"" + timestamp + "\",";
    payload += "\"gsr\":" + String(gsr, 1) + ",";
    payload += "\"heartbeat\":" + String(heartRate) + ",";
    payload += "\"spo2\":" + String(spo2) + ",";
    payload += "\"temperature\":" + String(temperature, 2) + ",";
    payload += "\"stress_score\":" + String(stressScore, 2) + ",";
    payload += "\"headband_connected\":" + String(connected ? "true" : "false");
    payload += "}]";

    // Debug output
    Serial.print("Raw GSR: ");
    Serial.print(rawGSR);
    Serial.print(", Normalized GSR: ");
    Serial.println(gsr);
    Serial.print("Payload: ");
    Serial.println(payload);
    Serial.print("Connection status: ");
    Serial.println(connected ? "Connected" : "Disconnected");

    int httpResponseCode = http.POST(payload);
    Serial.print("POST Status: ");
    Serial.println(httpResponseCode);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}

void loop() {
    // Read sensors
    float rawGSR = analogRead(GSR_PIN);
    float normalizedGSR = normalizeGSR(rawGSR);
    bodyTempSensor.requestTemperatures();
    float bodyTemp = bodyTempSensor.getTempCByIndex(0);
    float ambientTemp = dht.readTemperature();
    float humidity = dht.readHumidity();
    
    // For demo purposes - replace with actual sensor readings
    int heartRate = particleSensor.getIR() > 50000 ? random(60, 90) : 0;
    int spo2 = random(95, 100);

    // Update connection status
    headbandConnected = (millis() - lastDataTime) < CONNECTION_TIMEOUT;
    digitalWrite(CONNECTION_LED, headbandConnected ? HIGH : LOW);

    // Calculate current stress score
    float currentStress = calculateStressScore(normalizedGSR, heartRate, spo2, bodyTemp);
    
    // Update moving average
    stressHistory[stressIndex] = currentStress;
    stressIndex = (stressIndex + 1) % STRESS_WINDOW_SIZE;
    
    // Calculate average stress
    float avgStress = 0.0f;
    for (int i = 0; i < STRESS_WINDOW_SIZE; i++) {
        avgStress += stressHistory[i];
    }
    avgStress /= STRESS_WINDOW_SIZE;
    
    // Update LED indicators
    updateLEDs(avgStress);
    
    // Send data to Supabase (now including rawGSR)
    sendToSupabase(rawGSR, normalizedGSR, heartRate, spo2, bodyTemp, avgStress, headbandConnected);
    
    // Update last data time
    lastDataTime = millis();
    
    delay(10000);  // 10 seconds delay
}