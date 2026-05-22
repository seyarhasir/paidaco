type PageIntroProps = {
  kicker: string;
  title: string;
  body: string;
};

export function PageIntro({ kicker, title, body }: PageIntroProps) {
  return (
    <section className="page-intro">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      <p>{body}</p>
    </section>
  );
}
