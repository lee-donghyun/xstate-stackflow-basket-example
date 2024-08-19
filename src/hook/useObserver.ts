import { DependencyList, useEffect, useRef } from "react";

export const useObserver = <T extends Element>(
  onObserve: () => void,
  dependencyList: DependencyList,
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) onObserve();
      });
      observer.observe(element);
      return () => observer.unobserve(element);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencyList);

  return { ref };
};
