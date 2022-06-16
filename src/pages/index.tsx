import {
  BackspaceIcon,
  PencilAltIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { useLayoutEffect, useState } from "react";
import SimpleEmptyState from "../components/EmptyStates/simpleEmptyState";
import Sidebar from "../components/PageComponents/sidebar";
import SignatureItem from "../components/PDFHandling/components/SignatureItem";
import PDFDocumentWrapper from "../components/PDFHandling/PDFDocumentWrapper";
import { PDFPage } from "../components/PDFHandling/PDFPage";
import { Pdf, usePdf } from "../hooks/usePdf";
import { usePDF_JSXElements } from "../hooks/usePDFPageJSXElements";
import { UploadTypes, useUploader } from "../hooks/useUploader";
import { classNames } from "../utils/classNames";
import { ggID } from "../utils/helpers";
import { prepareAssets } from "../utils/prepareAssets";
import { render } from "../utils/render";

prepareAssets();

export default function Example() {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [drawingModalOpen, setDrawingModalOpen] = useState(false);

  const {
    file,
    initialize,
    pageIndex,
    isMultiPage,
    isFirstPage,
    isLastPage,
    currentPage,
    isSaving,
    savePdf,
    previousPage,
    nextPage,
    setDimensions,
    name,
    dimensions,
    reset: resetPDF,
    pages,
  } = usePdf();

  const {
    reset: resetElements,
    add: addElement,
    allPageElements,
    pageElements,
    remove: removeElement,
    setPageIndex,
    update: updateElement,
  } = usePDF_JSXElements();

  const initializePageAndAttachments = (pdfDetails: Pdf) => {
    initialize(pdfDetails);
    const numberOfPages = pdfDetails.pages.length;
    resetElements(numberOfPages);
  };

  const {
    inputRef: pdfInput,
    handleClick: handlePdfClick,
    isUploading,
    onClick,
    upload: uploadPdf,
  } = useUploader({
    use: UploadTypes.PDF,
    afterUploadPdf: initializePageAndAttachments,
  });

  const {
    inputRef: imageInput,
    handleClick: handleImageClick,
    onClick: onImageClick,
    upload: uploadImage,
  } = useUploader({
    use: UploadTypes.IMAGE,
    // afterUploadAttachment: addAttachment,
  });

  useLayoutEffect(() => setPageIndex(pageIndex), [pageIndex, setPageIndex]);

  const hiddenInputs = (
    <>
      <input
        data-testid="pdf-input"
        ref={pdfInput}
        type="file"
        name="pdf"
        id="pdf"
        accept="application/pdf"
        onChange={uploadPdf}
        onClick={onClick}
        style={{ display: "none" }}
      />
      <input
        ref={imageInput}
        type="file"
        id="image"
        name="image"
        accept="image/*"
        onClick={onImageClick}
        style={{ display: "none" }}
        onChange={uploadImage}
      />
    </>
  );

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Top nav*/}
        {/* <Header /> */}

        {/* Bottom section */}
        <div className="min-h-0 flex-1 flex overflow-hidden">
          {/* Narrow sidebar*/}
          <Sidebar />

          {/* Main area */}
          <main
            className={classNames(
              "relative min-w-0 flex-1 border-t  bg-gray-100 lg:flex border-gray-200",
              file &&
                // "bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600"
                "bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800"
            )}
          >
            {/* Primary column */}
            <section
              aria-labelledby="primary-heading"
              className="min-w-0 flex-1 h-full flex flex-col overflow-y-auto lg:order-last"
            >
              <h1 id="primary-heading" className="sr-only">
                PDF Viewer
              </h1>
              {/* Your content */}
              <div className="min-h-screen">
                <div className="flex flex-1 h-full items-center justify-center">
                  {hiddenInputs}
                  {render(
                    !file && (
                      <>
                        {" "}
                        <SimpleEmptyState
                          description="Nenhum PDF Carregado"
                          subDescription="Clique no botão abaixo para carregar um PDF"
                          title="Adicionar PDF"
                          loading={isUploading}
                          onClick={handlePdfClick}
                        />
                      </>
                    ),
                    file && (
                      <>
                        <div className="relative w-full">
                          <PDFDocumentWrapper
                            {...{
                              dimensions,
                              nextPage,
                              previousPage,
                              totalPages: (pages as any[]).length,
                            }}
                          >
                            {(pages as any[]).map((pdfPage: any, index) => {
                              return (
                                <div className="relative" key={index}>
                                  <PDFPage
                                    pageElements={allPageElements[index]}
                                    dimensions={dimensions}
                                    updateDimensions={setDimensions}
                                    updateElement={updateElement}
                                    page={pdfPage}
                                    pageIndex={index}
                                  />
                                </div>
                              );
                            })}
                          </PDFDocumentWrapper>
                          <div className="absolute top-0 w-full h-16 bg-neutral-600/50 backdrop-blur-lg shadow-lg">
                            <div className="grid grid-cols-3 h-full">
                              <div className=""></div>
                              <div className="flex flex-1 justify-center items-center">
                                <span className="text-white center font-semibold">
                                  Página {pageIndex + 1} de{" "}
                                  {(pages as any[]).length}
                                </span>
                              </div>
                              <div className="flex flex-1 h-full items-center">
                                {render(
                                  allPageElements && (
                                    <div
                                      className={classNames(
                                        "ml-auto mr-1",
                                        !allPageElements.some(
                                          (item: any[]) => item.length !== 0
                                        ) && "invisible"
                                      )}
                                    >
                                      <button
                                        className="bg-gray-200/30 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                                        onClick={() => {
                                          resetElements(
                                            (pages as any[]).length
                                          );
                                        }}
                                      >
                                        <BackspaceIcon className="h-5 w-5 text-white" />
                                      </button>
                                    </div>
                                  )
                                )}
                                <div className="ml-5 mr-5">
                                  <button
                                    className="bg-gray-200/30 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                                    onClick={() => {
                                      resetElements((pages as any[]).length);
                                      resetPDF();
                                    }}
                                  >
                                    <TrashIcon className="h-5 w-5 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            </section>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className="hidden lg:block lg:flex-shrink-0 lg:order-first">
              <div className="h-full relative flex flex-col w-96 border-r border-gray-200 bg-white overflow-y-auto">
                {/* Your content */}
                <h1 id="primary-heading" className="sr-only">
                  Content Management
                </h1>
                <div className="min-h-screen">
                  {render(
                    file &&
                      !allPageElements.some(
                        (item: any[]) => item.length !== 0
                      ) ? (
                      <>
                        <div className="h-full flex items-center justify-center px-5">
                          <SimpleEmptyState
                            description="Adicionar campo de assinatura"
                            subDescription="Vá até a página desejada e clique no botão abaixo para adicionar o elemento"
                            title="Adicionar Assinatura"
                            loading={isUploading}
                            onClick={() => {
                              addElement({
                                type: "signature",
                                data: {
                                  text: "",
                                },
                                pageNumber: pageIndex + 1,
                                id: ggID(),
                                height: -1,
                                width: -1,
                                x: -1,
                                y: -1,
                              });
                            }}
                            icon={PencilAltIcon}
                          />
                        </div>
                      </>
                    ) : (
                      <div className=" max-h-screen overflow-y-scroll pb-10">
                        <div className="flex flex-col flex-1 p-5 space-y-5">
                          {(allPageElements as any[]).map(
                            (pg, pageIndexElements) => {
                              if (pg.length === 0) {
                                return null;
                              }
                              return (
                                <>
                                  <div className="">
                                    <h2 className="mb-2 font-bold">
                                      Página {pageIndexElements + 1}
                                    </h2>
                                    <div className="space-y-6">
                                      {(pg as any[]).map(
                                        (
                                          item: JSXAttachment,
                                          JSXAttachmentIndex
                                        ) => {
                                          return (
                                            <>
                                              <SignatureItem
                                                {...{
                                                  data: item.data,
                                                  onRemoveElement: () => {
                                                    removeElement(
                                                      JSXAttachmentIndex,
                                                      pageIndexElements
                                                    );
                                                  },
                                                  onChange: (text) => {
                                                    updateElement(
                                                      JSXAttachmentIndex,
                                                      {
                                                        data: {
                                                          text: text,
                                                        },
                                                      },
                                                      pageIndexElements
                                                    );
                                                  },
                                                }}
                                              />
                                              <span className="mt-5 text-center">
                                                X Position: {item.x} | Y
                                                Position: {item.y}
                                              </span>
                                            </>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          )}
                        </div>
                        {file && (
                          <div className="w-full ">
                            <button
                              type="button"
                              onClick={() => {
                                addElement({
                                  type: "signature",
                                  data: {
                                    text: "",
                                  },
                                  pageNumber: pageIndex + 1,
                                  id: ggID(),
                                  height: -1,
                                  width: -1,
                                  x: -1,
                                  y: -1,
                                });
                              }}
                              className="inline-flex w-full px-2 rounded-lg justify-center items-center py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-transparent hover:bg-gray-100 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-100 transition-all"
                            >
                              <PlusIcon
                                className="-ml-1 mr-2 h-5 w-5 text-gray-800"
                                aria-hidden="true"
                              />
                              <span className="text-gray-800">
                                {" "}
                                Adicionar Signatário
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </>
  );
}
