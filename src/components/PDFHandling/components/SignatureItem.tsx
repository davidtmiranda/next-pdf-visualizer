import { TrashIcon } from "@heroicons/react/solid";
import React from "react";

interface props {
  data: any;
  onChange(text: string): void;
  onRemoveElement(): void;
}
export default function SignatureItem({
  data,
  onChange,
  onRemoveElement,
}: props) {
  const [text, SetText] = React.useState(data.text || "");
  return (
    <div className="flex flex-col p-3 rounded-lg border-t-2 border-t-yellow-400 shadow-lg relative">
      <div className="flex items-center">
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-normal text-gray-700"
          >
            Nome do Signatário
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="email"
              id="email"
              value={text}
              onChange={(e) => {
                SetText(e.target.value);
                onChange(e.target.value);
              }}
              className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder=""
            />
          </div>
        </div>{" "}
        <div className="flex mt-auto justify-center">
          <button
            className="ml-2 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => {
              onRemoveElement();
            }}
          >
            <TrashIcon className="h-5 w-5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
