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

  const handleDownload = () => {
    if (croppedFace) {
      const link = document.createElement("a");
      link.href = croppedFace;
      link.download = "cropped_face.jpg";
      link.click();
    }
  };

  console.log("Cropping face:", detections);
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

  return (
    <div className="face-app">
      <h1>Face Cropper</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {croppedFace && (
        <button onClick={handleDownload}>Download Cropped Face</button>
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
              {detections.length > 0 && (
                <div className="face-boxes">
                  {detections.map((detection, index) => (
                    <div
                      key={index}
                      className="face-box"
                      style={{
                        position: "absolute",
                        left: `${detection._box._x}px`,
                        top: `${detection._box._y}px`,
                        width: `${detection._box._width}px`,
                        height: `${detection._box._height}px`,
                        border: "2px solid #00ff00",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        backgroundColor: "rgba(0, 255, 0, 0.25)",
                      }}
                      onClick={() => cropFace(detection)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FaceApp;
