import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2.5 px-4 sm:px-6">
        <Logo />
        <span className="font-bold">Lead Manager</span>
      </div>
    </header>
  );
}
