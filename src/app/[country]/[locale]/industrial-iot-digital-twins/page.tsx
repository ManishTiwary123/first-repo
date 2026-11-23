import type { Metadata } from "next";
import { IotPage, IOT_FAQ } from "@/components/platform/pages/IotPage";
import { getPlatformContext } from "@/components/platform/context";
import { buildFaqJsonLd } from "@/lib/seo";
import {
  buildPlatformBreadcrumbJsonLd,
  buildPlatformMetadata,
  buildPlatformServiceJsonLd,
  jsonLd,
} from "@/lib/platform/seo";

type Params = Promise<{ country: string; locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { country, locale } = await params;
  return buildPlatformMetadata({ page: "iot", country, locale });
}

export default async function Page({ params }: { params: Params }) {
  const { country, locale } = await params;
  const ctx = getPlatformContext(country, locale);
  // The FAQ markup is built from the array the page renders, so the two cannot differ.
  const structured = [
    buildPlatformBreadcrumbJsonLd("iot", country),
    buildPlatformServiceJsonLd("iot", country, "Industrial IoT integration and digital twins"),
    buildFaqJsonLd([...IOT_FAQ]),
  ];
  return (
    <>
      {structured.map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      ))}
      <IotPage ctx={ctx} />
    </>
  );
}
