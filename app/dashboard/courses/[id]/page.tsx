import DashboardPage from "@/components/dashboard-page";

export default async function DashboardByCourse({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <DashboardPage params={params} />;
}
