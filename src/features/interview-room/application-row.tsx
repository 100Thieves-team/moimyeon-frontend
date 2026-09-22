"use client";

import { Popover } from "@base-ui/react/popover";
import { Collapsible } from "@base-ui/react/collapsible";
import { Toast } from "@base-ui/react/toast";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import { TrustCardPopover, type TrustCardPayload } from "@/features/trust-card/trust-card-popover";
import * as trustCardStyles from "@/features/trust-card/trust-card.css";
import {
  formatAppliedAt,
  getApplicationActionError,
  getApplicationSummary,
  type RoomApplication,
} from "./interview-room-model";
import { RejectApplicationDialog } from "./reject-application-dialog";
import { useApplicationActions } from "./use-application-actions";
import * as styles from "./interview-room.css";

export function ApplicationRow({
  application,
  roomId,
  refreshFailed,
  refreshing,
}: {
  application: RoomApplication;
  roomId: string;
  refreshFailed: boolean;
  refreshing: boolean;
}) {
  const [profileHandle] = useState(() => Popover.createHandle<TrustCardPayload>());
  const toastManager = Toast.useToastManager();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const {
    processing,
    accept: acceptMutation,
    reject: rejectMutation,
    refresh,
  } = useApplicationActions(roomId);
  const nickname = application.applicant?.nickname ?? "신청자 정보 없음";
  const summary = getApplicationSummary(application);
  const actionable = application.status === "PENDING";

  const profile = (
    <>
      <span className={styles.avatar} aria-hidden="true">
        {Array.from(nickname.trim())[0] ?? "?"}
      </span>
      <span className={styles.identity}>
        <span className={styles.nickname}>{nickname}</span>
        {application.applicant && application.applicant.jobRoles.length > 0 && (
          <span className={styles.meta}>
            {application.applicant.jobRoles.map((role) => role.name).join(" · ")}
          </span>
        )}
      </span>
    </>
  );

  const path = { roomId, applicationId: String(application.applicationId) };

  function accept() {
    setError(null);
    acceptMutation.mutate(
      { path },
      {
        onSuccess: ({ data }) => {
          if (data?.status === "SLOT_EXCEEDED")
            setNotice("신청자의 참여 슬롯이 가득 차 수락되지 않았어요.");
          else if (data?.status === "ACCEPTED")
            toastManager.add({ title: "참여 신청을 수락했어요." });
        },
        onError: (actionError) => setError(getApplicationActionError(actionError).message),
      },
    );
  }

  return (
    <li>
      <Collapsible.Root className={styles.application}>
        <div className={styles.row}>
          <div className={styles.profile}>
            {application.applicant ? (
              <>
                <Popover.Trigger
                  handle={profileHandle}
                  payload={{ memberId: application.applicant.memberId }}
                  aria-label={`${nickname} 공개 신뢰 카드 열기`}
                  className={trustCardStyles.trigger}
                  openOnHover
                  delay={300}
                  closeDelay={150}
                >
                  {profile}
                </Popover.Trigger>
                <TrustCardPopover handle={profileHandle} />
              </>
            ) : (
              profile
            )}
          </div>
          <p className={styles.excerpt}>{summary}</p>
          <time
            className={styles.appliedAt}
            dateTime={application.appliedAt}
            title={application.appliedAt}
          >
            {formatAppliedAt(application.appliedAt)}
          </time>
          <div className={styles.actions}>
            {actionable ? (
              <>
                <Button
                  disabled={processing !== null}
                  onClick={() => {
                    setError(null);
                    setRejectOpen(true);
                  }}
                  size="sm"
                  variant="secondary"
                >
                  반려
                </Button>
                <Button disabled={processing !== null} onClick={accept} size="sm">
                  {processing === "accept" ? "수락 중..." : "수락"}
                </Button>
              </>
            ) : (
              <span className={styles.status}>{application.statusLabel}</span>
            )}
          </div>
          <Collapsible.Trigger aria-label={`${nickname} 신청 내용`} className={styles.expand}>
            <ChevronDown aria-hidden="true" size={18} />
          </Collapsible.Trigger>
        </div>
        <Collapsible.Panel className={styles.details}>
          <div>
            <h3 className={styles.meta}>전할 말</h3>
            <p className={styles.note}>{application.note || "전달 사항이 없어요."}</p>
          </div>
        </Collapsible.Panel>
        {(error || notice || refreshFailed) && (
          <div className={styles.feedback}>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            {notice && <output>{notice}</output>}
            {refreshFailed && (
              <>
                <p className={styles.error} role="alert">
                  최신 목록을 불러오지 못했어요. 다시 불러와 처리 결과를 확인해 주세요.
                </p>
                <Button disabled={refreshing} onClick={refresh} size="sm" variant="secondary">
                  목록 다시 불러오기
                </Button>
              </>
            )}
          </div>
        )}
      </Collapsible.Root>
      {rejectOpen && (
        <RejectApplicationDialog
          open={rejectOpen}
          onOpenChange={setRejectOpen}
          onReject={(reason, callbacks) => {
            rejectMutation.mutate(
              { path, body: { reason } },
              {
                onSuccess: () => {
                  toastManager.add({ title: "참여 신청을 반려했어요." });
                  callbacks.onSuccess();
                },
                onError: callbacks.onError,
              },
            );
          }}
          pending={processing === "reject"}
          actionable={actionable}
        />
      )}
    </li>
  );
}
