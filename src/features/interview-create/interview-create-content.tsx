"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import {
  jobRolesOptions,
  participationSlotsOptions,
  regionsOptions,
  roomFormOptionsOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { InterviewCreateWizard } from "./interview-create-wizard";

export function InterviewCreateContent() {
  const [
    { data: roomFormOptionsResponse },
    { data: jobRolesResponse },
    { data: regionsResponse },
    { data: participationSlotsResponse },
  ] = useSuspenseQueries({
    queries: [
      roomFormOptionsOptions(),
      jobRolesOptions(),
      regionsOptions(),
      participationSlotsOptions(),
    ],
  });
  const roomFormOptions = roomFormOptionsResponse.data;
  const jobRoles = jobRolesResponse.data;
  const regions = regionsResponse.data;
  const participationSlots = participationSlotsResponse.data;

  if (roomFormOptions === undefined) {
    throw new Error("Failed to load room form options");
  }

  if (jobRoles === undefined) {
    throw new Error("Failed to load job roles");
  }

  if (regions === undefined) {
    throw new Error("Failed to load regions");
  }

  if (participationSlots === undefined) {
    throw new Error("Failed to load participation slots");
  }

  return (
    <InterviewCreateWizard
      jobRoleGroups={jobRoles.groups}
      options={roomFormOptions}
      participationSlots={participationSlots}
      regions={regions}
    />
  );
}
