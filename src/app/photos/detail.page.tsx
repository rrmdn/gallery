import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { usePhoto } from "./hooks/pexels";
import { useCallback, useMemo } from "react";
import { css } from "@emotion/react";
import { useImageLoader } from "./hooks/useImageLoader";
import fitWindow from "./utils/fitWindow";

function PhotoDetailPage() {
  const { id } = useParams();
  const photo = usePhoto(Number(id));
  const nav = useNavigate();
  const goBack = useCallback(() => {
    nav(-1);
  }, [nav]);
  const fittedWindow = useMemo(() => {
    if (!photo.data) {
      return null;
    }

    return fitWindow(
      window.innerWidth,
      window.innerHeight,
      photo.data.width,
      photo.data.height
    );
  }, [photo.data]);
  const theImage = useImageLoader(
    photo.data?.src.original +
      `?auto=compress\u0026cs=tinysrgb\u0026dpr=2\u0026w=${10}` || "",
    photo.data?.src.original || ""
  );
  if (!photo.data) {
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
        `}
      >
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div
      css={css`
        background: ${photo.data.avg_color || "none"};
        width: 100vw;
        height: 100vh;
        overflowx: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        css={css`
          padding: 16px;
          position: relative;
          width: ${fittedWindow ? fittedWindow.width + "px" : "100%"};
          height: ${fittedWindow ? fittedWindow.height + "px" : "100%"};
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
        <div
          css={css`
            overflow: hidden;
            border-radius: 16px;
          `}
        >
          <img
            css={css`
              filter: ${!theImage.loaded ? "blur(16px)" : "none"};
              width: 100%;
              height: 100%;
              overflow: hidden;
            `}
            src={theImage.image}
            alt={photo.data.photographer}
          />
        </div>
      </div>
    </div>
  );
}

export default PhotoDetailPage;
