import type { JobRolesResponse, MemberMeResponse, PublicProfileResponse } from "@/api";

type Member = NonNullable<MemberMeResponse["data"]>;
type PublicProfile = NonNullable<PublicProfileResponse["data"]>;
type JobRoleGroups = NonNullable<JobRolesResponse["data"]>["groups"];

export type MyPageData = {
  jobRoleGroups: JobRoleGroups;
  member: Member;
  publicProfile: PublicProfile;
};

export type ProfileCompany = Member["profile"]["interestCompanies"][number];
export type JobRoleGroup = JobRoleGroups[number];
export type JobRoleOption = JobRoleGroup["roles"][number];
export type ProfileTrust = PublicProfile["trust"];
