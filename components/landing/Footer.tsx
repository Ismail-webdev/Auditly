export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 py-8 text-center text-sm text-zinc-400">
      &copy; {currentYear} Auditly. All rights reserved.
    </footer>
  );
}
