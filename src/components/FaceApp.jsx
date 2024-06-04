import { useState } from "react";
import { useFaceDetection } from "../hooks/useFaceDetection";

function FaceApp() {
  const [imageUrl, setImageUrl] = useState(null);
  const [croppedFace, setCroppedFace] = useState(null);
  const { detections, isDetecting } = useFaceDetection(imageUrl);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const cropFace = (detection) => {
    if (detection) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const { _x, _y, _width, _height } = detection._box;
        canvas.width = _width;
        canvas.height = _height;
        ctx.drawImage(img, _x, _y, _width, _height, 0, 0, _width, _height);
        const croppedDataURL = canvas.toDataURL("image/jpeg");
        setCroppedFace(croppedDataURL);
      };
    }
  };

  const handleDownload = (detection) => {
    cropFace(detection);

    if (croppedFace) {
      const link = document.createElement("a");
      link.href = croppedFace;
      link.download = "cropped_face.jpg";
      link.click();
    }
  };

  return (
    <div className="face-app">
      <h1>Face Cropper</h1>
      <input
        type="file"
        accept="image/*"
        style={{
          padding: "10px",
          margin: "10px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
        onChange={handleImageUpload}
      />
      {/* {croppedFace && (
        <button onClick={handleDownload}>Download Cropped Face</button>
      )} */}
      {detections.length > 0 && (
        <div className="face-boxes">
          {detections.map((detection, index) => (
            <button
              key={index}
              onClick={() => handleDownload(detection)}
              style={{
                backgroundColor: "blue",
                color: "white",
                padding: "10px",
                margin: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                cursor: "pointer",
                
              }}
            >
              Download Cropped Face
            </button>
          ))}
        </div>
      )}
      {imageUrl && (
        <>
          {isDetecting ? (
            <p>Detecting faces...</p>
          ) : (
            <div
              className="image-container"
              style={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                maxWidth: "40vw",
                margin: "0 auto",
              }}
            >
              <img
                src={imageUrl}
                className="main-img"
                alt="Uploaded image"
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FaceApp;
