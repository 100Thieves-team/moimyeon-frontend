import { Suspense, type ReactNode } from "react";
import { LoginDialogController } from "@/features/auth/login-dialog-controller";
import { AnalyticsSession } from "@/features/analytics/analytics-session";
import { getCurrentMemberState } from "@/features/auth/current-member-server";
import { TopBar } from "@/features/navigation/top-bar";
import * as styles from "./layout.css";

type SiteLayoutProps = {
  children: ReactNode;
};

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const state = await getCurrentMemberState();
  const memberId = state.status === "authenticated" ? state.member.memberId : null;
  return (
    <AnalyticsSession
      memberId={memberId}
      memberProperties={
        state.status === "authenticated"
          ? {
              name: state.member.nickname,
              email: state.member.email,
              member_status: state.member.status,
            }
          : undefined
      }
    >
      <div className={styles.site}>
        <TopBar />
        <Suspense fallback={null}>
          <LoginDialogController showDevLogin={process.env.NODE_ENV === "development"} />
        </Suspense>
        {children}
      </div>
    </AnalyticsSession>
  );
}
