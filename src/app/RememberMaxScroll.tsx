import { useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";

export const RememberMaxScroll = () => {
  const location = useLocation();
  const scrollHeightByPath = useMemo(() => {
    return new Map<string, number>();
  }, []);
  useEffect(
    function restoreScroll() {
      const scrollHeight = scrollHeightByPath.get(location.pathname);
      if (scrollHeight) {
        setTimeout(() => {
          window.scrollTo(0, scrollHeight);
        }, 0);
      }
    },
    [location.pathname, scrollHeightByPath]
  );

  useEffect(
    function listenScroll() {
      function handleScroll() {
        scrollHeightByPath.set(location.pathname, window.scrollY);
      }
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    },
    [location.pathname, scrollHeightByPath]
  );

  return null;
};
