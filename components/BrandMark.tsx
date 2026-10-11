/** Logo: a pencil sketching a page. Decorative; the brand name is real text beside it. */
export function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="42" height="42" rx="10" fill="var(--primary)" />
      <path d="M14 13h15l5 5v17H14z" fill="none" stroke="var(--on-primary)" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M18 22h12M18 27h9" stroke="var(--on-primary)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M27 36l1.2-4.6L37 22.6l3.4 3.4-8.8 8.8z" fill="var(--accent)" stroke="var(--on-primary)" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
