"use client";

import { useLayoutEffect, useState } from "react";
import { OpenPanelLeft, OpenPanelFilledLeft } from "@carbon/icons-react";

interface ILayoutProps {
  children: React.ReactNode;
  leftPanelContent?: React.ReactNode;
}

export const Layout = ({ children, leftPanelContent }: ILayoutProps) => {
  const [leftSidebarIsOpen, setLeftSidebarIsOpen] = useState<boolean>(false);

  useLayoutEffect(() => {
    const stored_sidebar_check =
      window.localStorage.getItem("leftSidebarIsOpen");
    setLeftSidebarIsOpen(
      typeof stored_sidebar_check !== "undefined"
        ? stored_sidebar_check === "true"
        : true
    );
  }, []);

  // rest of your component
  return (
    <div className="flex w-full h-full min-h-screen overflow-hidden text-gray-700 bg-bg">
      <div
        className="flex-shrink-0 overflow-x-hidden w-[15rem] border-r shadow-lg px-3 py-6 max-h-screen"
        style={{
          display: leftSidebarIsOpen ? undefined : "none",
        }}
      >
        {leftPanelContent}
      </div>
      <div className="relative flex flex-col flex-1 max-h-screen overflow-hidden">
        <main className="flex-1 w-full h-full overflow-auto">
          <div
            className="fixed left-0 z-40 text-gray-500"
            style={{
              transform: leftSidebarIsOpen ? "translateX(15rem)" : undefined,
            }}
          >
            <button
              className="px-3 py-6 hover:text-gray-600"
              onClick={() => {
                window.localStorage.setItem(
                  "leftSidebarIsOpen",
                  `${!leftSidebarIsOpen}`
                );
                setLeftSidebarIsOpen(!leftSidebarIsOpen);
              }}
            >
              {leftSidebarIsOpen ? (
                <OpenPanelFilledLeft aria-label="Close sidebar" />
              ) : (
                <OpenPanelLeft aria-label="Open sidebar" />
              )}
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};
