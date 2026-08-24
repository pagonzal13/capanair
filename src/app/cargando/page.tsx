import { LoadingScreen } from "./LoadingScreen";

export const metadata = { title: "Preparando la web" };

function safeRedirectTarget(value: string | undefined): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return "/";
}

export default function CargandoPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const redirectTo = safeRedirectTarget(searchParams.redirect);
  return <LoadingScreen redirectTo={redirectTo} />;
}
