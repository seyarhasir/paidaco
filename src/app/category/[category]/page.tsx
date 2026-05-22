import { redirect } from "next/navigation";

type CategoryRedirectProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryRedirect({ params }: CategoryRedirectProps) {
  const { category } = await params;
  redirect(`/fa/category/${category}`);
}
