import React, { useEffect, useRef, useState } from "react";
import Draggable, { DraggableEvent } from "react-draggable";
import { render } from "../../utils/render";

interface Props {
  page: any;
  dimensions?: Dimensions;
  updateDimensions: ({ width, height }: Dimensions) => void;
  pageElements?: JSXAttachments;
  pageIndex: number;
  updateElement: (
    attachmentIndex: number,
    attachment: Partial<JSXElementAttachment>,
    pageIndex: number
  ) => void;
}

export const PDFPage = ({
  page,
  dimensions,
  updateDimensions,
  pageElements,
  pageIndex,
  updateElement,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState((dimensions && dimensions.width) || 0);
  const [height, setHeight] = useState((dimensions && dimensions.height) || 0);

  React.useEffect(() => {
    console.log({ pageElements });
  }, [pageElements]);

  useEffect(() => {
    const renderPage = async (p: Promise<any>) => {
      const _page = await p;
      if (_page) {
        const context = canvasRef.current?.getContext("2d");
        const viewport = _page.getViewport({ scale: 1 });

        setWidth(viewport.width);
        setHeight(viewport.height);

        if (context) {
          await _page.render({
            canvasContext: canvasRef.current?.getContext("2d"),
            viewport,
          }).promise;

          const newDimensions = {
            width: viewport.width,
            height: viewport.height,
          };

          console.log({ newDimensions });

          updateDimensions(newDimensions as Dimensions);
        }
      }
    };

    renderPage(page);
  }, [page, updateDimensions]);

  const elementWidth = 200;
  const elementHeight = 56;

  function onMove(
    e: DraggableEvent,
    data: any,
    attachmentIndex: number,
    pageNumber: number
  ) {
    const xParsed = Number((data.x as number).toFixed(2));
    const yParsed = Number((data.y as number).toFixed(2));

    const centerCoordinatesOfElementAdded = {
      x: xParsed + elementWidth / 2,
      y: yParsed + elementHeight / 2,
    };

    const { x, y } = centerCoordinatesOfElementAdded;
    updateElement && updateElement(attachmentIndex, { x, y }, pageNumber);
  }

  const RightBorder = width - elementWidth;
  const BottomBorder = height - elementHeight;

  return (
    <div>
      <canvas ref={canvasRef} width={width} height={height} />
      {render(
        dimensions && pageElements && (
          <>
            {pageElements.map((element, attachmentIndex) => {
              let lastX = element.x;
              let lastY = element.y;
              const { x, y } = getElementsDefaultPosition(
                element.x,
                element.y,
                {
                  bottomBorder: BottomBorder,
                  rightBorder: RightBorder,
                }
              );
              if (lastX === -1 || lastY === -1) {
                updateElement(attachmentIndex, { x, y }, pageIndex);
              }
              console.log({
                sr: pageIndex + 1 === element.pageNumber,
                pageIndex: pageIndex + 1,
                elementPageNumber: element.pageNumber,
              });
              return (
                <>
                  {render(
                    true && (
                      <Draggable
                        onStop={(e, data) =>
                          onMove(
                            e,
                            data,
                            attachmentIndex,
                            element.pageNumber - 1
                          )
                        }
                        {...{
                          bounds: {
                            top: 0,
                            left: 0,
                            right: RightBorder,
                            bottom: BottomBorder,
                          },
                          defaultPosition: {
                            x,
                            y,
                          },
                          scale: 1,
                        }}
                      >
                        <button
                          style={{
                            width: elementWidth,
                            height: elementHeight,
                          }}
                          className="absolute top-0 left-0 rounded-lg shadow-lg bg-yellow-500/80 backdrop-blur-lg cursor-move ring-1 ring-offset-2 ring-transparent hover:ring-yellow-600 hover:bg-yellow-600/80 hover:scale-110 transition-colors"
                        >
                          <span className="text-black font-medium text-xs">
                            {element.type === "signature" ? "Assinatura" : ""}
                          </span>
                          <span className="text-black px-3 text-md font-semibold block truncate">
                            {element.data.text || ""}
                          </span>
                        </button>
                      </Draggable>
                    )
                  )}
                </>
              );
            })}
          </>
        )
      )}
    </div>
  );
};

// get random numbers between min and max
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
interface defaultPositionProps {
  rightBorder: number;
  bottomBorder: number;
}
function getElementsDefaultPosition(
  x: number,
  y: number,
  { bottomBorder, rightBorder }: defaultPositionProps
) {
  if (x === -1) {
    x = getRandomInt(40, rightBorder - 40);
  }
  if (y === -1) {
    y = getRandomInt(40, bottomBorder - 40);
  }
  if (bottomBorder < 40) {
    y = 0;
  }
  if (rightBorder < 40) {
    x = 0;
  }
  return { x, y };
}
