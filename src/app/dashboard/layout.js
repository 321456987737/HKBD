import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardRootLayout({ children }) {
  return (
    <>
    <div className="flex">
      <DashboardLayout />
      {children}
    </div>
    </>
  );
}
