import * as faceapi from "@vladmandic/face-api";
import { useEffect, useState, useRef } from "react";

export const useFaceDetection = (imageUrl) => {
  const [detections, setDetections] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const loadModel = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"), // Update path if needed
        ]);
      } catch (error) {
        console.error("Error loading models: ", error);
      }
    };

    const detectFaces = async () => {
      try {
        setIsDetecting(true);
        await loadModel(); // Wait for model loading before detection
        const img = await faceapi.fetchImage(imageUrl);
        const detections = await faceapi.detectAllFaces(
          img,
          new faceapi.SsdMobilenetv1Options()
        );
        if (isMounted.current) {
          setDetections(detections);
          setIsDetecting(false);
        }
      } catch (error) {
        console.error("Error detecting faces: ", error);
        if (isMounted.current) {
          setIsDetecting(false);
        }
      }
    };

    if (imageUrl) {
      console.log(imageUrl); // Optional logging
      detectFaces();
    } else {
      setDetections([]);
    }

    return () => {
      isMounted.current = false;
    };
  }, [imageUrl]);

  return { detections, isDetecting };
};
