import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TermsPage } from "@/features/terms/terms-page";

const terms = {
  privacy: {
    title: "개인정보 처리방침",
    type: "PRIVACY",
  },
  service: {
    title: "이용약관",
    type: "SERVICE",
  },
} as const;

function isTermsRoute(type: string): type is keyof typeof terms {
  return type in terms;
}

export async function generateMetadata({ params }: PageProps<"/terms/[type]">): Promise<Metadata> {
  const { type } = await params;

  return {
    title: isTermsRoute(type) ? terms[type].title : "약관",
  };
}

export default async function TermsRoute({ params }: PageProps<"/terms/[type]">) {
  const { type } = await params;

  if (!isTermsRoute(type)) {
    notFound();
  }

  return <TermsPage type={terms[type].type} />;
}
