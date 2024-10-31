import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { usePhoto } from "./hooks/pexels";
import { useCallback, useMemo } from "react";
import { css } from "@emotion/react";

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
      css={css`
        background: ${photo.data.avg_color || "none"};
        width: 100vw;
        height: 100vh;
        overflowX: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        css={css`
          padding: 16px;
          position: relative;
          width: ${imageWidthToFitWindow || "100%"};
        `}
      >
        <button
          css={css`
            position: absolute;
            top: 16px;
            left: 16px;
            margin: 16px;
            border-radius: 999px;
            backdrop-filter: blur(8px);
            background-color: rgba(0, 0, 0, 0.2);
            border: none;
          `}
          className="secondary"
          onClick={goBack}
        >
          <BiArrowBack />
        </button>
        <div
          css={css`
            position: absolute;
            bottom: 12px;
            left: 16px;
            margin: 16px;
          `}
        >
          <p
            css={css`
              color: rgba(255, 255, 255, 0.8);
              backdrop-filter: blur(8px);
              padding: 4px 8px;
              border-radius: 12px;
              background-color: rgba(0, 0, 0, 0.2);
            `}
          >
            <strong>{photo.data.photographer}</strong>: {photo.data.alt}
          </p>
        </div>
        <div>
          <img
            css={css`
              border-radius: 16px;
            `}
            src={photo.data.src.original}
            alt={photo.data.photographer}
          />
        </div>
      </div>
    </div>
  );
}

export default PhotoDetailPage;
