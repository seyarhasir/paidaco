import { redirect } from "next/navigation";

type CityRedirectProps = {
  params: Promise<{ city: string }>;
};

export default async function CityRedirect({ params }: CityRedirectProps) {
  const { city } = await params;
  redirect(`/fa/city/${city}`);
}
