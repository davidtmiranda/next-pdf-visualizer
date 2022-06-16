import React from "react";

interface props {
  children: React.ReactNode;
  dimensions?: Dimensions;
  nextPage: () => void;
  previousPage: () => void;
  totalPages: number;
}

const PDFDocumentWrapper: React.FC<props> = ({
  children,
  nextPage,
  previousPage,
  dimensions,
  totalPages,
}) => {
  const PageHeight = dimensions?.height || 0;

  const [PageIndex, SetPageIndex] = React.useState(1);

  React.useEffect(() => {
    console.log({
      PageHeight,
    });
  }, [PageHeight]);

  const handleScroll = (event: any) => {
    const { scrollHeight, scrollTop, clientHeight } = event.target;
    const scroll = scrollHeight - scrollTop - clientHeight;

    const pagePadding = 50;

    // calculate current page based on scroll position
    const currentPage = Math.floor(scrollTop / (PageHeight + pagePadding)) + 1;

    if (currentPage !== PageIndex) {
      SetPageIndex(currentPage);
      console.log({
        scroll,
        scrollTop,
        scrollHeight,
        clientHeight,
        PageHeight,
      });
    }

    if (currentPage > PageIndex) {
      nextPage();
    }
    if (currentPage < PageIndex) {
      previousPage();
    }
  };

  return (
    <div
      onScroll={handleScroll}
      className="flex flex-1 items-center p-10 pt-20 shadow-sm flex-col space-y-[50px] overflow-y-scroll max-h-screen"
    >
      {children}
    </div>
  );
};

export default PDFDocumentWrapper;
