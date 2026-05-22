import { redirect } from "next/navigation";

type SearchRedirectProps = {
  searchParams?: Promise<Record<string, string | undefined>>;
};

export default async function SearchRedirect({ searchParams }: SearchRedirectProps) {
  const params = new URLSearchParams();
  const search = (await searchParams) ?? {};
  Object.entries(search).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  redirect(`/fa/search${params.size ? `?${params.toString()}` : ""}`);
}
