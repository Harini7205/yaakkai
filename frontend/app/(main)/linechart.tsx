import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "../config";
import { Buffer } from "buffer";

const Linechart = () => {
  const [graphUri, setGraphUri] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          console.error("JWT Token not found");
          return;
        }

        const response = await fetch(`${BACKEND_URL}/get-test-results`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          if (data.message) {
            setMessage(data.message + " The next time you take an assessment, a graph will be displayed.");
          } else if (data.image) {
            const imageUri = `data:image/png;base64,${data.image}`;
            setGraphUri(imageUri);
          }
        } else {
          console.error("Error fetching test results");
          setMessage("Error fetching test results");
        }
      } catch (error) {
        console.error("Error fetching test results:", error);
        setMessage("Error fetching test results");
      }
    };

    fetchTestResults();
  }, []);

  return (
    <View style={{ marginVertical: 20, alignItems: "center" }}>
      {message ? (
        <Text style={{ textAlign: "center", fontSize: 16, color: "#FF0000" }}>{message}</Text>
      ) : graphUri ? (
        <Image source={{ uri: graphUri }} style={{ width: 250, height: 300, borderRadius: 10 }} />
      ) : (
        <ActivityIndicator size="large" color="#333" />
      )}
    </View>
  );
};

export default Linechart;
