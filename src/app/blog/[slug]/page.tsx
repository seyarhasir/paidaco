import { redirect } from "next/navigation";

type BlogPostRedirectProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostRedirect({ params }: BlogPostRedirectProps) {
  const { slug } = await params;
  redirect(`/fa/blog/${slug}`);
}
