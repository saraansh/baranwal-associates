import { Outlet, useRouteLoaderData } from "react-router";

import { Footer } from "~/components/footer";
import { Nav } from "~/components/nav";
import type { loader as rootLoader } from "~/root";

export default function PublicLayout() {
  const data = useRouteLoaderData<typeof rootLoader>("root");
  return (
    <>
      <Nav theme={data?.theme ?? "system"} />
      <Outlet />
      <Footer />
    </>
  );
}
