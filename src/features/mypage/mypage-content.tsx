"use client";

import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import {
  jobRolesOptions,
  memberMeOptions,
  publicProfileOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import type { MemberMeResponse } from "@/api/generated";
import { MyPageShell } from "./mypage-shell";
import { ProfileEditor } from "./profile-editor";
import { MockActivityReviews, MockResumeManager } from "@/features/interview-mock/mock-mypage-tabs";

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

  if (publicProfile === undefined) {
    throw new Error("Failed to load public profile");
  }

  if (jobRoles === undefined) {
    throw new Error("Failed to load job roles");
  }

  return (
    <MyPageShell
      activityContent={<MockActivityReviews />}
      publicProfile={publicProfile}
      resumeContent={<MockResumeManager />}
    >
      <ProfileEditor jobRoleGroups={jobRoles.groups} member={member} />
    </MyPageShell>
  );
}

export function MyPageContent() {
  const { data: memberResponse } = useSuspenseQuery(memberMeOptions());
  const member = memberResponse.data;

  if (member === undefined) {
    throw new Error("Failed to load member");
  }

  return <MyPageDetails member={member} />;
}
