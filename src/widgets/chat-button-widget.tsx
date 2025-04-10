import { SparklesIcon } from "lucide-react";

import TailwindCSS from "@/tailwindcss";

export default function ChatButtonWidget() {
  return (
    <TailwindCSS>
      <button
        className="bg-secondary text-secondary-foreground hover:bg-secondary ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        onClick={() => {
          const event = new CustomEvent("open-sa-chatbox", {
            bubbles: true,
            composed: true,
            detail: { open: true },
          });
          document.dispatchEvent(event);
        }}
      >
        <SparklesIcon />
        Ask AI
      </button>
    </TailwindCSS>
  );
}
