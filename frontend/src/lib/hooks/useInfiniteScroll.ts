import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
    threshold?: number;
}

export function useInfiniteScroll(
    callback: () => void,
    isLoading: boolean,
    hasMore: boolean,
    options: UseInfiniteScrollOptions = {}
) {
    const observer = useRef<IntersectionObserver | null>(null);
    const { threshold = 0.5 } = options;

    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    callback();
                }
            }, { threshold });

            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore, callback, threshold]
    );

    return { lastElementRef };
}
