"use client";

import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import {
  jobRolesOptions,
  memberMeOptions,
  publicProfileOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { Suspense } from "react";
import type { MemberMeResponse } from "@/api/generated";
import { MyPageShell } from "./mypage-shell";
import { ProfileEditor } from "./profile-editor";
import { ReceivedReviews, ReceivedReviewsFallback } from "./received-reviews";

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
      reviews={
        <Suspense fallback={<ReceivedReviewsFallback />}>
          <ReceivedReviews />
        </Suspense>
      }
      profile={<ProfileEditor jobRoleGroups={jobRoles.groups} member={member} />}
      publicProfile={publicProfile}
    />
  );
}

export function MyPageContent() {
  const { data: memberResponse } = useSuspenseQuery(memberMeOptions());
  const member = memberResponse.data;

  if (member === undefined || member === null) {
    throw new Error("Failed to load member");
  }

  return <MyPageDetails member={member} />;
}
