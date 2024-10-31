import { PhotosWithTotalResults, createClient } from "pexels";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

export const useSearchPhotos = (
  initialQuery: string = ""
) => {
  const client = useMemo(() => {
    return createClient(import.meta.env.VITE_PEXELS_API_KEY);
  }, []);
  const [state, setState] = useState({
    query: initialQuery,
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
      return [state.query, pageIndex + 1].join(",");
    },
    [state.query]
  );
  const results = useSWRInfinite(
    getPage,
    async (arg: string) => {
      const [query, page] = arg.split(",");
      return client.photos
        .search({
          query: query || "nature",
          page: parseInt(page),
          per_page: 30,
        })
        .then((res) => {
          if ("error" in res) {
            throw new Error(res.error);
          }
          return res;
        })
        .catch(async (error) => {
          // must be 429, retry at least 5 seconds later
          await new Promise((resolve) => setTimeout(resolve, 5000));
          throw error;
        });
    },
    {
      revalidateFirstPage: false,
    }
  );
  const isLoadingMore =
    results.isLoading ||
    (results.size > 0 &&
      results.data &&
      typeof results.data[results.size - 1] === "undefined");
  const isRefreshing =
    results.isValidating &&
    results.data &&
    results.data.length === results.size;

  const loadMore = useCallback(() => {
    if (isLoadingMore || isRefreshing) {
      return;
    }
    results.setSize(results.size + 1);
  }, [results.size, isLoadingMore, isRefreshing]);
  return {
    query: state.query,
    onSearch,
    results,
    loadMore,
  };
};

export const usePhoto = (id: number) => {
  const client = useMemo(() => {
    return createClient(import.meta.env.VITE_PEXELS_API_KEY);
  }, []);
  const photo = useSWR(
    [id],
    async ([id]) => {
      return client.photos
        .show({ id })
        .then((res) => {
          if ("error" in res) {
            throw new Error(res.error);
          }
          return res;
        })
        .catch(async (error) => {
          // must be 429, retry at least 5 seconds later
          await new Promise((resolve) => setTimeout(resolve, 5000));
          throw error;
        });
    },
    {
      revalidateOnFocus: false,
    }
  );
  return photo;
};
