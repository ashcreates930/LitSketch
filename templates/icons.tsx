/** Simple line icons. Always decorative: the text beside them carries the meaning. */

const PATHS = {
  pencil: "M4 20l1-5L16 4l4 4L9 19l-5 1z M14 6l4 4",
  search: "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z M15.5 15.5L21 21",
  bulb: "M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  question: "M9 9a3 3 0 1 1 4.2 2.7c-.8.4-1.2 1-1.2 1.8V15 M12 18.5v.5 M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19z",
  list: "M9 6h11 M9 12h11 M9 18h11 M4.5 6h.5 M4.5 12h.5 M4.5 18h.5",
  book: "M4 5c3-1.5 5.5-1.5 8 0v14c-2.5-1.5-5-1.5-8 0z M12 5c2.5-1.5 5-1.5 8 0v14c-3-1.5-5.5-1.5-8 0",
  steps: "M4 19h5v-5h5V9h6 M17 6l3 3-3 3",
  quote: "M5 11h4v6H4v-5c0-3 1.5-5 4-6 M15 11h4v6h-5v-5c0-3 1.5-5 4-6",
  check: "M4 12.5l5 5L20 6.5",
  web: "M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z M5 5a2 2 0 1 0 0 .1z M19 5a2 2 0 1 0 0 .1z M5 19a2 2 0 1 0 0 .1z M19 19a2 2 0 1 0 0 .1z M6.5 6.5l3.6 3.6 M17.5 6.5l-3.6 3.6 M6.5 17.5l3.6-3.6 M17.5 17.5l-3.6-3.6",
  cloud: "M7 18a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9.5z",
  chat: "M4 5h16v10H10l-5 4v-4H4z",
  star: "M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z",
  key: "M8.5 15.5a4 4 0 1 1 3.4-6.1L21 9.5V13h-2v2h-2v-2.3l-5.1.1a4 4 0 0 1-3.4 2.7z",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg className={`ls-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
