import { PhotosWithTotalResults, createClient } from "pexels";
import { useCallback, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";

export const useSearchPhotos = () => {
  const client = useMemo(() => {
    return createClient(import.meta.env.VITE_PEXELS_API_KEY);
  }, []);
  const [state, setState] = useState({
    query: "",
  });
  const onSearch = useCallback((query: string) => {
    setState((state) => ({
      ...state,
      query,
    }));
  }, []);
  const getPage = useCallback(
    (pageIndex: number, previousPageData: PhotosWithTotalResults) => {
      if (previousPageData && !previousPageData.photos.length) {
        return null;
      }
      return [state.query, pageIndex + 1];
    },
    [state.query]
  );
  const results = useSWRInfinite(
    getPage,
    async (query: string, page: number) => {
      return client.photos
        .search({
          query,
          page,
          per_page: 30,
        })
        .then((res) => {
          if ("error" in res) {
            throw new Error(res.error);
          }
          return res;
        });
    }
  );
  const loadMore = useCallback(() => {
    if (results.isLoading) return;
    results.setSize(results.size + 1);
  }, [results]);
  return {
    query: state.query,
    onSearch,
    results,
    loadMore,
  };
};
