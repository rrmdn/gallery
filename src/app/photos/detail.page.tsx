import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { usePhoto } from "./hooks/pexels";
import { useCallback, useMemo } from "react";

function PhotoDetailPage() {
  const { id } = useParams();
  const photo = usePhoto(Number(id));
  const nav = useNavigate();
  const goBack = useCallback(() => {
    nav(-1);
  }, [nav]);
  const imageWidthToFitWindow = useMemo(() => {
    if (!photo.data) {
      return null;
    }
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const imageWidth = photo.data.width;
    const imageHeight = photo.data.height;
    const aspectRatio = imageWidth / imageHeight;
    const widthToFitWindow = windowHeight * aspectRatio;
    return widthToFitWindow > windowWidth ? windowWidth : widthToFitWindow;
  }, [photo.data]);
  if (!photo.data) {
    return null;
  }
  return (
    <div
      style={{
        background: photo.data.avg_color || "none",
        width: "100vw",
        height: "100vh",
        overflowX: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: 16,
          position: "relative",
          width: imageWidthToFitWindow || "100%",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            margin: 16,
            borderRadius: 999,
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            border: "none",
          }}
          className="secondary"
          onClick={goBack}
        >
          <BiArrowBack />
        </button>
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 16,
            margin: 16,
          }}
        >
          <p
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              padding: "4px 8px",
              borderRadius: 12,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
          >
            <strong>{photo.data.photographer}</strong>: {photo.data.alt}
          </p>
        </div>
        <div>
          <img
            style={{
              borderRadius: 16,
            }}
            src={photo.data.src.original}
            alt={photo.data.photographer}
          />
        </div>
      </div>
    </div>
  );
}

export default PhotoDetailPage;
