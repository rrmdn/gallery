import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchPhotos } from "./hooks/pexels";
import MasonryGrid from "../../shared/components/MasonryGrid";
import { useInView } from "react-intersection-observer";
import { Photos } from "pexels";
import { Link } from "react-router-dom";

type Photo = Photos["photos"][number];

const LazyPhotoRenderer = memo(({ photo }: { photo: Photo }) => {
  const placeholderImg = useMemo(() => {
    return (
      photo.src.original +
      `?auto=compress\u0026cs=tinysrgb\u0026dpr=2\u0026w=${5}`
    );
  }, [photo.src.original]);
  const [state, setState] = useState({
    src: "",
  });
  const isPreloading = !state.src || state.src === placeholderImg;
  const photoVisibility = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) {
        // load the image gradually
        const placeholder = new Image();
        placeholder.src = placeholderImg;
        setState((state) => ({
          ...state,
          src: placeholderImg,
        }));
        placeholder.addEventListener("load", () => {
          const img = new Image();
          img.src = photo.src.medium;
          img.addEventListener("load", () => {
            setState((state) => ({
              ...state,
              src: photo.src.medium,
            }));
          });
        });
      }
    },
  });
  return (
    <div
      style={{
        padding: "8px",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
      ref={photoVisibility.ref}
    >
      {photoVisibility.inView && (
        <Link to={`/photos/${photo.id}`}>
          <span
            style={{
              position: "absolute",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              padding: "2px 6px",
              borderRadius: 6,
              margin: 4,
              maxWidth: "90%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
            }}
          >
            {photo.photographer}
          </span>
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              width: "100%",
              height: "100%",
              background: photo.avg_color || "none",
            }}
          >
            <img
              style={{
                width: "100%",
                // blur image while loading
                filter: isPreloading ? "blur(16px)" : "none",
                overflow: "hidden",
              }}
              src={state.src}
              alt={photo.photographer}
            />
          </div>
        </Link>
      )}
    </div>
  );
});

function PhotosHomePage() {
  const { onSearch, results, loadMore } = useSearchPhotos();
  const [query, setQuery] = useState("");
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [onSearch]
  );
  useEffect(
    function searchPhotos() {
      const timeout = setTimeout(() => {
        onSearch(query);
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    },
    [query, onSearch]
  );
  const photos = useMemo(() => {
    return results?.data?.flatMap((page) => page.photos) ?? [];
  }, [results.data]);
  const loaderObserver = useInView({
    threshold: 0,
  });
  useEffect(
    function loadMorePhotos() {
      if (loaderObserver.inView) {
        loadMore();
      }
    },
    [loaderObserver.inView, loadMore]
  );
  return (
    <main
      style={{
        height: "100vh",
      }}
    >
      <div
        style={{
          marginTop: 72,
        }}
      >
        <MasonryGrid
          items={photos}
          keyAccessor={"id"}
          heightAccessor="height"
          widthAccessor="width"
          columns={4}
        >
          {(photo) => {
            return <LazyPhotoRenderer photo={photo} />;
          }}
        </MasonryGrid>
        <div ref={loaderObserver.ref}>
          <h1
            style={{
              display: "block",
              width: "100%",
              height: 200,
              textAlign: "center",
              padding: "8px",
            }}
          >
            {results?.isLoading
              ? "Loading..."
              : results?.isValidating
                ? "Loading more..."
                : ""}
          </h1>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          height: 72,
          left: 0,
          right: 0,
          top: 0,
          padding: "8px 16px",
        }}
      >
        <input
          type="search"
          name="search"
          placeholder="Search photos"
          aria-label="Search"
          onChange={handleSearch}
        />
      </div>
    </main>
  );
}

export default PhotosHomePage;
