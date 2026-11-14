import { notFound } from "next/navigation";
import { cases, getCase } from "@/content/cases";
import { pageMetadata } from "@/lib/seo";
import { DmcCaseStudy } from "@/components/dmc/DmcCaseStudy";
import { CaseStudyPage } from "@/components/cases/CaseStudyPage";
import { dmc } from "@/content/case-studies/dripmycard";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  const description =
    item.layout === "dripmycard" ? dmc.summary : item.story ? item.story[0].slice(0, 155).replace(/\s\S*$/, "…") : item.summary;
  const meta = pageMetadata({
    title: item.headline ? `${item.client} — ${item.headline}` : item.client,
    description,
    path: `/cases/${item.slug}`,
  });
  const og = item.hero ?? item.image;
  if (og && meta.openGraph) {
    meta.openGraph.images = [{ url: og.src, width: og.w, height: og.h, alt: og.alt }];
    if (meta.twitter) meta.twitter.images = [og.src];
  }
  return meta;
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();

  const idx = cases.findIndex((c) => c.slug === item.slug);
  const next = cases[(idx + 1) % cases.length];

  if (item.layout === "dripmycard") return <DmcCaseStudy next={next} />;
  return <CaseStudyPage item={item} index={idx} next={next} />;
}
