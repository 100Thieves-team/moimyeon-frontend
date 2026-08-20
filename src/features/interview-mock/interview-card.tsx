"use client";

import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { MockInterview } from "./mock-data";
import * as styles from "./interview-mock.css";

type SelectItem<Value extends string> = { label: string; value: Value };

type MockSelectProps<Value extends string> = {
  ariaLabel: string;
  className?: string;
  items: SelectItem<Value>[];
  onValueChange: (value: Value) => void;
  value: Value;
};

export function MockSelect<Value extends string>({
  ariaLabel,
  className,
  items,
  onValueChange,
  value,
}: MockSelectProps<Value>) {
  return (
    <div className={className}>
      <Select.Root
        items={items}
        onValueChange={(nextValue) => {
          if (nextValue !== null) onValueChange(nextValue);
        }}
        value={value}
      >
        <Select.Trigger aria-label={ariaLabel} className={styles.selectTrigger}>
          <Select.Value className={styles.selectValue} />
          <Select.Icon className={styles.selectIcon}>
            <ChevronDown aria-hidden="true" size={15} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className={styles.selectPositioner} sideOffset={4}>
            <Select.Popup className={styles.selectPopup}>
              <Select.List className={styles.selectList}>
                {items.map((item) => (
                  <Select.Item className={styles.selectItem} key={item.value} value={item.value}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator>
                      <Check aria-hidden="true" size={13} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

function getRelationLabel(relation: MockInterview["relation"]) {
  if (relation === "host") return "내가 만든 면접";
  if (relation === "participant") return "참여 중";
  if (relation === "pending") return "신청 중";
  return null;
}

export function InterviewCard({ href, interview }: { href: string; interview: MockInterview }) {
  const relationLabel = getRelationLabel(interview.relation);

  return (
    <Link className={styles.card} href={href}>
      <div className={styles.cardMeta}>
        <span className={styles.cardMetaText}>
          {interview.methodLabel} · {interview.region}
        </span>
        <span
          className={`${styles.statusBadge} ${interview.status === "closing" ? styles.closingBadge : ""}`}
        >
          {interview.status === "closing" ? "마감 임박" : "모집 중"}
        </span>
      </div>
      {relationLabel ? <span className={styles.relationBadge}>{relationLabel}</span> : null}
      <h3 className={styles.cardTitle}>{interview.title}</h3>
      <p className={styles.cardCompany}>
        {interview.company} · {interview.jobRoleLabel} · {interview.roundLabel}
      </p>
      <div className={styles.cardFoot}>
        <span className={styles.cardSchedule}>
          <span>{interview.dateLabel}</span>
          <span>{interview.timeLabel}</span>
        </span>
        <span className={styles.participantCount}>
          {interview.currentParticipants} / {interview.maxParticipants}명
        </span>
      </div>
    </Link>
  );
}

export function SessionSummary({
  interview,
  trailing,
}: {
  interview: MockInterview;
  trailing?: ReactNode;
}) {
  return (
    <div className={styles.summaryCard}>
      <div aria-hidden="true" className={styles.summaryIcon}>
        {interview.company[0]}
      </div>
      <div className={styles.summaryCopy}>
        <strong className={styles.summaryTitle}>{interview.title}</strong>
        <span className={styles.summaryMeta}>
          {interview.dateLabel} {interview.timeLabel} · {interview.methodLabel}
        </span>
      </div>
      {trailing}
    </div>
  );
}
