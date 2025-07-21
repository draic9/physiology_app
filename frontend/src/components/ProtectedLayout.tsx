import TopNav from "./TopNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="pt-16 bg-gray-50 dark:bg-gray-900">{children}</div>
    </>
  );
}