import { useState } from 'react';

interface UsePaginationProps<T> {
    items: T[];
    defaultItemsPerPage?: number;
}

interface UsePaginationReturn<T> {
    currentItems: T[];
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    setItemsPerPage: (count: number) => void;
    handlePageChange: (page: number) => void;
    totalItems: number;
}

export const usePagination = <T,>({ items, defaultItemsPerPage = 10 }: UsePaginationProps<T>): UsePaginationReturn<T> => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Ensure current page is valid when items change
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }

    const currentItems = items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSetItemsPerPage = (count: number) => {
        setItemsPerPage(count);
        setCurrentPage(1);
    };

    return {
        currentItems,
        currentPage,
        totalPages,
        itemsPerPage,
        setItemsPerPage: handleSetItemsPerPage,
        handlePageChange,
        totalItems: items.length
    };
};
