import type { Metadata } from "next";
import { CadCamPage, CAD_CAM_FAQ } from "@/components/platform/pages/CadCamPage";
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
  return buildPlatformMetadata({ page: "cadCam", country, locale });
}

export default async function Page({ params }: { params: Params }) {
  const { country, locale } = await params;
  const ctx = getPlatformContext(country, locale);
  // The FAQ markup is built from the array the page renders, so the two cannot differ.
  const structured = [
    buildPlatformBreadcrumbJsonLd("cadCam", country),
    buildPlatformServiceJsonLd("cadCam", country, "CAD, CAM and ERP systems integration"),
    buildFaqJsonLd([...CAD_CAM_FAQ]),
  ];
  return (
    <>
      {structured.map((data, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      ))}
      <CadCamPage ctx={ctx} />
    </>
  );
}
