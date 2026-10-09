"use client";

import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import {
  jobRolesOptions,
  memberMeOptions,
  publicProfileOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { Suspense, useEffect } from "react";
import { syncAnalyticsMember } from "@/features/analytics/analytics";
import type { MemberMeResponse } from "@/api/generated";
import { MyPageShell } from "./mypage-shell";
import { ProfileEditor } from "./profile-editor";
import { ReceivedReviews, ReceivedReviewsFallback } from "./received-reviews";
import { ResumeManagerSkeleton } from "./resume-manager-skeleton";
import { ResumeManager } from "./resume-manager";

type Member = NonNullable<MemberMeResponse["data"]>;

type MyPageDetailsProps = {
  member: Member;
};

function MyPageDetails({ member }: MyPageDetailsProps) {
  const [{ data: publicProfileResponse }, { data: jobRolesResponse }] = useSuspenseQueries({
    queries: [publicProfileOptions({ path: { memberId: member.memberId } }), jobRolesOptions()],
  });
  const publicProfile = publicProfileResponse.data;
  const jobRoles = jobRolesResponse.data;

  if (publicProfile === undefined || publicProfile === null) {
    throw new Error("Failed to load public profile");
  }

  if (jobRoles === undefined || jobRoles === null) {
    throw new Error("Failed to load job roles");
  }

  return (
    <MyPageShell
      reviewsPanel={
        <Suspense fallback={<ReceivedReviewsFallback />}>
          <ReceivedReviews />
        </Suspense>
      }
      profilePanel={<ProfileEditor jobRoleGroups={jobRoles.groups} member={member} />}
      publicProfile={publicProfile}
      resumePanel={
        <Suspense fallback={<ResumeManagerSkeleton />}>
          <ResumeManager />
        </Suspense>
      }
    />
  );
}

export function MyPageContent() {
  const { data: memberResponse } = useSuspenseQuery(memberMeOptions());
  const member = memberResponse.data;

  const { memberId, nickname, email, status } = member ?? {};
  useEffect(() => {
    if (memberId && nickname !== undefined && email !== undefined && status !== undefined)
      syncAnalyticsMember(memberId, { name: nickname, email, member_status: status });
  }, [memberId, nickname, email, status]);

  if (member === undefined || member === null) {
    throw new Error("Failed to load member");
  }

  return <MyPageDetails member={member} />;
}
