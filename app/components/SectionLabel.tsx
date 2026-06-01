export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 h-px bg-accent" />
      <span className="text-accent text-xs tracking-[0.3em] uppercase font-medium">
        {children}
      </span>
    </div>
  );
}
