import { useCallback, useMemo } from "react";
import { useSearchPhotos } from "./hooks/pexels";
import MasonryGrid from "../../shared/components/MasonryGrid";

function PhotosHomePage() {
  const { onSearch, query, results } = useSearchPhotos();
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onSearch(event.target.value);
    },
    [onSearch]
  );
  const photos = useMemo(() => {
    return results?.data?.flatMap((page) => page.photos) ?? [];
  }, [results.data]);
  return (
    <main
      style={{
        height: "100vh",
      }}
    >
      <div
        style={{
          height: 80,
        }}
      >
        <input
          type="search"
          name="search"
          value={query}
          placeholder="Search photos"
          aria-label="Search"
          onChange={handleSearch}
        />
      </div>
      <div
        style={{
          height: "calc(100vh - 80px)",
        }}
      >
        <MasonryGrid
          items={photos}
          keyAccessor={"id"}
          heightAccessor="height"
          widthAccessor="width"
          columns={5}
        >
          {(photo) => {
            return (
              <div
                style={{
                  padding: "6px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: 4,
                    borderRadius: 4,
                    margin: 4,
                  }}
                >
                  {photo.photographer}
                </span>
                <img
                  style={{
                    borderRadius: 4,
                  }}
                  src={photo.src.medium}
                  alt={photo.photographer}
                />
              </div>
            );
          }}
        </MasonryGrid>
      </div>
    </main>
  );
}

export default PhotosHomePage;
