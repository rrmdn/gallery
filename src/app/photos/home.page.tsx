import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchPhotos } from "./hooks/pexels";
import MasonryGrid from "../../shared/components/MasonryGrid";
import { useInView, InView } from "react-intersection-observer";
import { Photos } from "pexels";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { css } from "@emotion/react";

type Photo = Photos["photos"][number];

const PhotoRenderer = memo(({ photo }: { photo: Photo }) => {
  return (
    <Link to={`/photos/${photo.id}`}>
      <span
        css={css`
          position: absolute;
          color: white;
          background-color: rgba(0, 0, 0, 0.2);
          padding: 2px 6px;
          border-radius: 6px;
          margin: 4px;
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          backdrop-filter: blur(6px);
        `}
      >
        {photo.photographer}
      </span>
      <div
        css={css`
          border-radius: 8px;
          overflow: hidden;
          width: 100%;
          height: 100%;
          background: ${photo.avg_color || "none"};
        `}
      >
        <img
          css={css`
            width: 100%;
            overflow: hidden;
          `}
          src={photo.src.medium}
          alt={photo.photographer}
        />
      </div>
    </Link>
  );
});

function PhotosHomePage() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const { onSearch, results, loadMore } = useSearchPhotos(query);
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setParams({ q: event.target.value });
    },
    [setQuery, setParams]
  );
  const handleSmoothScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(
    function searchPhotos() {
      const timeout = setTimeout(() => {
        onSearch(query);
      }, 200);
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
      const timeout = setTimeout(() => {
        if (loaderObserver.inView) {
          loadMore();
        }
      }, 60);
      return () => {
        clearTimeout(timeout);
      };
    },
    [loaderObserver.inView, loadMore]
  );
  return (
    <main
      css={css`
        height: 100vh;
      `}
    >
      <div
        css={css`
          margin-top: 72px;
        `}
      >
        <MasonryGrid
          items={photos}
          keyAccessor={"id"}
          heightAccessor="height"
          widthAccessor="width"
          columns={4}
        >
          {(photo) => {
            return (
              <InView threshold={0}>
                {({ ref, inView }) => {
                  return (
                    <div
                      ref={ref}
                      css={css`
                        padding: 8px;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        position: relative;
                      `}
                    >
                      {inView ? <PhotoRenderer photo={photo} /> : null}
                    </div>
                  );
                }}
              </InView>
            );
          }}
        </MasonryGrid>
        <div ref={loaderObserver.ref}>
          <h1
            css={css`
              display: block;
              width: 100%;
              height: 200px;
              text-align: center;
              padding: 8px;
            `}
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
        css={css`
          position: fixed;
          height: 72px;
          left: 0;
          right: 0;
          top: 0;
          padding: 8px 16px;
        `}
      >
        <input
          type="search"
          name="search"
          placeholder="Search photos"
          aria-label="Search"
          value={query}
          onChange={handleSearch}
          onFocus={handleSmoothScrollToTop}
        />
      </div>
    </main>
  );
}

export default PhotosHomePage;
