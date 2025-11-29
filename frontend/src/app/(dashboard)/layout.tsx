// Dashboard layout - will be implemented in Task 5
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar and header will be added in Task 5 */}
      <main className="p-6">{children}</main>
    </div>
  );
}
