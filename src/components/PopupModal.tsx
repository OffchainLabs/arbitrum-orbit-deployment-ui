'use client';

import { useState } from 'react';

export function PopupModal() {
  const [close, setClose] = useState(true);

  return (
    <div className="flex items-center justify-center">
      {close && (
        <div
          className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800  dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              className="mr-2 h-4 w-4 flex-shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <h3 className="text-lg font-medium">Alert Message</h3>
          </div>
          <div className="text-md mb-4 mt-2 flex">
            Hey, Sorry for the inconvenience but we don't have implemented mobile responsive yet, So
            i request you all to use laptop or desktop for better experience. Thank You
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="rounded-lg border border-red-800 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-red-800 hover:bg-red-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-800"
              data-dismiss-target="#alert-additional-content-3"
              aria-label="Close"
              onClick={() => setClose(!close)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
