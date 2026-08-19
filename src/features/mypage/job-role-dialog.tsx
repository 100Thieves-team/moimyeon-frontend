"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Tabs } from "@base-ui/react/tabs";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { jobRoleDialog } from "./job-role-dialog-handle";
import * as styles from "./job-role-field.css";
import { JobRolePill } from "./job-role-pill";
import type { JobRoleGroup } from "./mypage-model";

type JobRoleDialogProps = {
  groups: JobRoleGroup[];
  onValueChange: (value: number[]) => void;
  value: number[];
};

function getOrderedRoles(groups: JobRoleGroup[]) {
  return groups.flatMap((group) => group.roles);
}

function getInitialGroupCode(groups: JobRoleGroup[], selectedIds: ReadonlySet<number>) {
  return (
    groups.find((group) => group.roles.some((role) => selectedIds.has(role.jobRoleId)))?.code ??
    null
  );
}

function haveSameIds(left: readonly number[], right: readonly number[]) {
  return left.length === right.length && left.every((id) => right.includes(id));
}

export function JobRoleDialog({ groups, onValueChange, value }: JobRoleDialogProps) {
  const orderedRoles = useMemo(() => getOrderedRoles(groups), [groups]);
  const [draftIds, setDraftIds] = useState<Set<number>>(() => new Set(value));
  const [activeGroupCode, setActiveGroupCode] = useState<string | null>(null);
  const activeGroup = groups.find((group) => group.code === activeGroupCode) ?? null;
  const draftRoles = orderedRoles.filter((role) => draftIds.has(role.jobRoleId));

  const handleOpenChange = (open: boolean) => {
    if (open) {
      /* Dialog가 열릴 때마다 관심 직무를 초기화 */
      const selectedIds = new Set(value);
      setDraftIds(selectedIds);
      setActiveGroupCode(getInitialGroupCode(groups, selectedIds));
    }
  };

  const removeDraftRole = (jobRoleId: number) => {
    setDraftIds((current) => {
      const next = new Set(current);
      next.delete(jobRoleId);
      return next;
    });
  };

  const updateActiveGroup = (nextValues: string[]) => {
    if (!activeGroup) {
      return;
    }

    const activeGroupIds = new Set(activeGroup.roles.map((role) => role.jobRoleId));
    setDraftIds((current) => {
      const next = new Set([...current].filter((id) => !activeGroupIds.has(id)));
      nextValues.forEach((id) => next.add(Number(id)));
      return next;
    });
  };

  const confirmSelection = () => {
    const nextValue = orderedRoles
      .filter((role) => draftIds.has(role.jobRoleId))
      .map((role) => role.jobRoleId);

    if (!haveSameIds(value, nextValue)) {
      onValueChange(nextValue);
    }
  };

  return (
    <Dialog.Root handle={jobRoleDialog} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <header className={styles.header}>
            <Dialog.Close aria-label="직무 선택 닫기" className={styles.backButton} type="button">
              <ArrowLeft aria-hidden="true" size={24} strokeWidth={1.75} />
            </Dialog.Close>
            <Dialog.Title className={styles.title}>직무 추가</Dialog.Title>
          </header>

          <Tabs.Root
            className={styles.dialogBody}
            onValueChange={(nextValue) => setActiveGroupCode(String(nextValue))}
            orientation="vertical"
            value={activeGroupCode}
          >
            <Tabs.List aria-label="직군" className={styles.groupList}>
              {groups.map((group) => {
                const selectedCount = group.roles.filter((role) =>
                  draftIds.has(role.jobRoleId),
                ).length;

                return (
                  <Tabs.Tab className={styles.groupTab} key={group.code} value={group.code}>
                    <span>{group.displayName}</span>
                    {selectedCount > 0 ? (
                      <span aria-label={`${selectedCount}개 선택`} className={styles.groupCount}>
                        {selectedCount}
                      </span>
                    ) : null}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>

            <section className={styles.roleSection}>
              {activeGroup ? (
                <Tabs.Panel className={styles.rolePanel} value={activeGroup.code}>
                  <h3 className={styles.groupTitle}>{activeGroup.displayName}</h3>
                  <ToggleGroup
                    aria-label={`${activeGroup.displayName} 직무`}
                    className={styles.roleList}
                    multiple
                    onValueChange={updateActiveGroup}
                    value={activeGroup.roles
                      .filter((role) => draftIds.has(role.jobRoleId))
                      .map((role) => String(role.jobRoleId))}
                  >
                    {activeGroup.roles.map((role) => (
                      <Toggle
                        className={styles.roleToggle}
                        key={role.jobRoleId}
                        value={String(role.jobRoleId)}
                      >
                        {role.displayName}
                      </Toggle>
                    ))}
                  </ToggleGroup>
                </Tabs.Panel>
              ) : (
                <p className={styles.emptyState}>직군을 선택해 주세요.</p>
              )}
            </section>
          </Tabs.Root>

          <footer className={styles.footer}>
            <div aria-label="선택한 직무" className={styles.selectedPills}>
              {draftRoles.map((role) => (
                <JobRolePill
                  key={role.jobRoleId}
                  onRemove={() => removeDraftRole(role.jobRoleId)}
                  role={role}
                  variant="footer"
                />
              ))}
            </div>
            <div className={styles.footerActions}>
              <Button
                disabled={draftRoles.length === 0}
                onClick={() => setDraftIds(new Set())}
                type="button"
                variant="secondary"
              >
                <RotateCcw aria-hidden="true" size={18} strokeWidth={1.75} />
                초기화
              </Button>
              <Dialog.Close render={<Button onClick={confirmSelection} type="button" />}>
                선택 완료
              </Dialog.Close>
            </div>
          </footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
