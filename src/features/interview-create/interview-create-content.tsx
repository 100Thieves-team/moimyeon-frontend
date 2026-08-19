"use client";

import { useSuspenseQueries } from "@tanstack/react-query";
import { jobRolesOptions, roomFormOptionsOptions } from "@/api/generated/@tanstack/react-query.gen";
import { InterviewCreateWizard } from "./interview-create-wizard";

export function InterviewCreateContent() {
  const [{ data: roomFormOptionsResponse }, { data: jobRolesResponse }] = useSuspenseQueries({
    queries: [roomFormOptionsOptions(), jobRolesOptions()],
  });
  const roomFormOptions = roomFormOptionsResponse.data;
  const jobRoles = jobRolesResponse.data;

  if (roomFormOptions === undefined) {
    throw new Error("Failed to load room form options");
  }

  if (jobRoles === undefined) {
    throw new Error("Failed to load job roles");
  }

  return <InterviewCreateWizard jobRoleGroups={jobRoles.groups} options={roomFormOptions} />;
}
