import { QueryClient } from "@tanstack/react-query";

// Create a QueryClient instance with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
      // cacheTime: 10 * 60 * 1000, // Removed as it is not a valid property
      refetchOnWindowFocus: false, // Prevent unnecessary re-fetching
      retry: 2, // Retry failed requests up to 2 times
    },
  },
});
