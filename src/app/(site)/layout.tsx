import { Suspense, type ReactNode } from "react";
import { LoginDialogController } from "@/features/auth/login-dialog-controller";
import { MockFlowProvider } from "@/features/interview-mock/mock-flow-store";
import { TopBar } from "@/features/navigation/top-bar";
import * as styles from "./layout.css";

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <MockFlowProvider>
      <div className={styles.site}>
        <TopBar />
        <Suspense fallback={null}>
          <LoginDialogController showDevLogin={process.env.NODE_ENV === "development"} />
        </Suspense>
        {children}
      </div>
    </MockFlowProvider>
  );
}
