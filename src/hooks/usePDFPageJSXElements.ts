import { useCallback, useReducer } from "react";

enum ActionType {
  RESET = "RESET",
  ADD_ELEMENT = "ADD_ELEMENT",
  REMOVE_ELEMENT = "REMOVE_ELEMENT",
  UPDATE_ELEMENT = "UPDATE_ELEMENT",
  UPDATE_PAGE_INDEX = "UPDATE_PAGE_INDEX",
}

interface State {
  pageIndex: number;
  allPageAttachments: JSXAttachments[];
  pageAttachments: JSXAttachments;
}

type Action =
  | { type: ActionType.UPDATE_PAGE_INDEX; pageIndex: number }
  | { type: ActionType.ADD_ELEMENT; attachment: JSXAttachment }
  | {
      type: ActionType.REMOVE_ELEMENT;
      attachmentIndex: number;
      pageIndex: number;
    }
  | {
      type: ActionType.UPDATE_ELEMENT;
      attachmentIndex: number;
      attachment: Partial<JSXAttachment>;
      pageIndex: number;
    }
  | { type: ActionType.RESET; numberOfPages: number };

const initialState: State = {
  pageIndex: -1,
  allPageAttachments: [],
  pageAttachments: [],
};

const reducer = (state: State, action: Action) => {
  const { pageIndex, allPageAttachments, pageAttachments } = state;

  switch (action.type) {
    case ActionType.ADD_ELEMENT: {
      const newAllPageAttachmentsAdd = allPageAttachments.map(
        (attachments, index) =>
          pageIndex === index
            ? [...attachments, action.attachment]
            : attachments
      );

      return {
        ...state,
        allPageAttachments: newAllPageAttachmentsAdd,
        pageAttachments: newAllPageAttachmentsAdd[pageIndex],
      };
    }
    case ActionType.REMOVE_ELEMENT: {
      let newAllPageAttachmentsRemove: JSXAttachments[];
      if (!action.pageIndex) {
        newAllPageAttachmentsRemove = allPageAttachments.map(
          (otherPageAttachments, index) =>
            pageIndex === index
              ? pageAttachments.filter(
                  (_, _attachmentIndex) =>
                    _attachmentIndex !== action.attachmentIndex
                )
              : otherPageAttachments
        );
      } else {
        newAllPageAttachmentsRemove = allPageAttachments.map(
          (otherPageAttachments, index) =>
            action.pageIndex === index
              ? pageAttachments.filter(
                  (_, _attachmentIndex) =>
                    _attachmentIndex !== action.attachmentIndex
                )
              : otherPageAttachments
        );
      }

      return {
        ...state,
        allPageAttachments: newAllPageAttachmentsRemove,
        pageAttachments: newAllPageAttachmentsRemove[pageIndex],
      };
    }
    case ActionType.UPDATE_ELEMENT: {
      if (pageIndex === -1) {
        return state;
      }
      let newAllPageAttachmentsUpdate: JSXAttachments[];
      if (!action.pageIndex) {
        newAllPageAttachmentsUpdate = allPageAttachments.map(
          (otherPageAttachments, index) =>
            pageIndex === index
              ? pageAttachments.map((oldAttachment, _attachmentIndex) =>
                  _attachmentIndex === action.attachmentIndex
                    ? { ...oldAttachment, ...action.attachment }
                    : oldAttachment
                )
              : otherPageAttachments
        );
      } else {
        newAllPageAttachmentsUpdate = allPageAttachments.map(
          (otherPageAttachments, index) =>
            action.pageIndex === index
              ? pageAttachments.map((oldAttachment, _attachmentIndex) =>
                  _attachmentIndex === action.attachmentIndex
                    ? { ...oldAttachment, ...action.attachment }
                    : oldAttachment
                )
              : otherPageAttachments
        );
      }

      return {
        ...state,
        allPageAttachments: newAllPageAttachmentsUpdate,
        pageAttachments: newAllPageAttachmentsUpdate[pageIndex],
      };
    }
    case ActionType.UPDATE_PAGE_INDEX: {
      return {
        ...state,
        pageIndex: action.pageIndex,
        pageAttachments: allPageAttachments[action.pageIndex],
      };
    }
    case ActionType.RESET: {
      return {
        pageIndex: 0,
        pageAttachments: [],
        allPageAttachments: Array(action.numberOfPages).fill([]),
      };
    }
    default: {
      return state;
    }
  }
};

export const usePDF_JSXElements = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { allPageAttachments, pageAttachments } = state;

  const add = (newAttachment: JSXAttachment) =>
    dispatch({ type: ActionType.ADD_ELEMENT, attachment: newAttachment });

  const remove = (attachmentIndex: number, pageIndex: number) =>
    dispatch({ type: ActionType.REMOVE_ELEMENT, attachmentIndex, pageIndex });

  const update = (
    attachmentIndex: number,
    attachment: Partial<JSXAttachment>,
    pageIndex: number
  ) =>
    dispatch({
      type: ActionType.UPDATE_ELEMENT,
      attachmentIndex,
      attachment,
      pageIndex,
    });

  const reset = (numberOfPages: number) =>
    dispatch({ type: ActionType.RESET, numberOfPages });

  const setPageIndex = useCallback(
    (index: number) =>
      dispatch({ type: ActionType.UPDATE_PAGE_INDEX, pageIndex: index }),
    [dispatch]
  );

  return {
    add,
    reset,
    remove,
    update,
    setPageIndex,
    pageElements: pageAttachments,
    allPageElements: allPageAttachments,
  };
};
