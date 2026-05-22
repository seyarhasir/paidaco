import { redirect } from "next/navigation";

type BusinessRedirectProps = {
  params: Promise<{
    city: string;
    slug: string;
  }>;
};

export default async function BusinessRedirect({ params }: BusinessRedirectProps) {
  const { city, slug } = await params;
  redirect(`/fa/business/${city}/${slug}`);
}
