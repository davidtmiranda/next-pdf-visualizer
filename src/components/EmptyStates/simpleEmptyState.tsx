/* This example requires Tailwind CSS v2.0+ */
import { PlusIcon } from "@heroicons/react/solid";
import { render } from "../../utils/render";
import ActivityIndicator from "../Loading/ActivityIndicator";

interface Props {
  loading?: boolean;
  onClick?: () => void;
  title: string;
  icon?(props: React.ComponentProps<"svg">): JSX.Element;
  description: string;
  subDescription: string;
}

export default function SimpleEmptyState({
  loading,
  onClick,
  title,
  icon,
  description,
  subDescription,
}: Props) {
  const props = {
    icon,
  };
  return (
    <div className="text-center">
      {render(
        props.icon && (
          <props.icon className="mx-auto h-12 w-12 text-gray-400" />
        ),

        !icon && (
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
        )
      )}

      <h3 className="mt-2 text-sm font-medium text-gray-900">{description}</h3>
      <p className="mt-1 text-sm text-gray-500">{subDescription}</p>
      <div className="mt-6">
        <button
          disabled={loading}
          type="button"
          onClick={onClick}
          className="inline-flex min-w-[10rem] justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          {render(
            loading && (
              <>
                {" "}
                <ActivityIndicator className="h-5 w-5 fill-white " />
              </>
            ),
            !loading && (
              <>
                {render(
                  true && (
                    <PlusIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  )
                )}
                {title}
              </>
            )
          )}
        </button>
      </div>
    </div>
  );
}
