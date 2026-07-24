import type { Metadata } from "next";
import { breakpoints, grid, sprinkles, textStyle, vars } from "@/styles";
import * as styles from "./page.css";

export const metadata: Metadata = {
  title: "Design System Foundation",
};

const SAMPLE_TEXT = "모이면에서 가볍게 만나요 — Aa Gg 0123";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={`${textStyle.h3} ${sprinkles({ marginTop: "sectionSm", marginBottom: "lg" })}`}>
      {children}
    </h2>
  );
}

function TokenLabel({ name, value }: { name: string; value: string }) {
  return (
    <div className={sprinkles({ display: "flex", flexDirection: "column" })}>
      <span className={textStyle.p2}>{name}</span>
      <span className={`${textStyle.caption} ${sprinkles({ color: "tertiary" })}`}>{value}</span>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className={styles.container}>
      <h1 className={textStyle.h1}>Foundation</h1>
      <p className={`${textStyle.p1Body} ${sprinkles({ color: "secondary", marginTop: "md" })}`}>
        DESIGN.md 파운데이션 토큰의 Vanilla Extract 구현을 검증하는 페이지입니다. 다크 모드는 시스템
        설정을 따라 자동 전환됩니다.
      </p>

      <div
        className={sprinkles({ display: "flex", alignItems: "center", gap: "sm", marginTop: "lg" })}
      >
        <div className={styles.ruler} />
        <span className={textStyle.caption}>1.6rem ruler — 정확히 16px이어야 함</span>
      </div>

      <SectionTitle>Color — {Object.keys(vars.color).length} tokens</SectionTitle>
      <div className={sprinkles({ display: "flex", flexWrap: "wrap", gap: "lg" })}>
        {Object.entries(vars.color).map(([name, reference]) => (
          <div key={name} className={styles.swatchCard}>
            <div className={styles.swatchChips}>
              <span className={styles.swatchSurface({ tone: "base" })}>
                <span className={styles.chip} style={{ backgroundColor: reference }} />
              </span>
              <span className={styles.swatchSurface({ tone: "white" })}>
                <span className={styles.chip} style={{ backgroundColor: reference }} />
              </span>
            </div>
            <TokenLabel name={name} value={reference} />
          </div>
        ))}
      </div>

      <SectionTitle>Spacing — {Object.keys(vars.spacing).length} tokens</SectionTitle>
      <div className={sprinkles({ display: "flex", flexDirection: "column", gap: "sm" })}>
        {Object.entries(vars.spacing).map(([name, reference]) => (
          <div
            key={name}
            className={sprinkles({ display: "flex", alignItems: "center", gap: "lg" })}
          >
            <span
              className={`${textStyle.caption} ${sprinkles({ color: "tertiary" })}`}
              style={{ width: "12rem" }}
            >
              {name}
            </span>
            <div className={styles.spacingBar} style={{ width: reference }} />
          </div>
        ))}
      </div>

      <SectionTitle>Typography — {Object.keys(textStyle).length} styles</SectionTitle>
      <div className={sprinkles({ display: "flex", flexDirection: "column" })}>
        {Object.entries(textStyle).map(([name, className]) => (
          <div key={name} className={styles.typeRow}>
            <span className={`${textStyle.caption} ${sprinkles({ color: "tertiary" })}`}>
              {name}
            </span>
            <p className={className}>{SAMPLE_TEXT}</p>
          </div>
        ))}
      </div>

      <SectionTitle>Radius — {Object.keys(vars.radius).length} tokens</SectionTitle>
      <div className={sprinkles({ display: "flex", flexWrap: "wrap", gap: "lg" })}>
        {Object.entries(vars.radius).map(([name, reference]) => (
          <div
            key={name}
            className={sprinkles({ display: "flex", flexDirection: "column", gap: "xs" })}
          >
            <div className={styles.specimenBox} style={{ borderRadius: reference }} />
            <TokenLabel name={name} value={reference} />
          </div>
        ))}
      </div>

      <SectionTitle>Shadow — {Object.keys(vars.shadow).length} tokens</SectionTitle>
      <div className={sprinkles({ display: "flex", flexWrap: "wrap", gap: "3xl" })}>
        {Object.entries(vars.shadow).map(([name, reference]) => (
          <div
            key={name}
            className={sprinkles({ display: "flex", flexDirection: "column", gap: "sm" })}
          >
            <div className={styles.shadowBox} style={{ boxShadow: reference }} />
            <TokenLabel name={name} value={reference} />
          </div>
        ))}
      </div>

      <SectionTitle>Motion</SectionTitle>
      <div
        className={sprinkles({
          display: "flex",
          flexWrap: "wrap",
          gap: "3xl",
          alignItems: "flex-start",
        })}
      >
        <div className={styles.motionCard}>
          <p className={textStyle.p2}>Hover me</p>
          <p className={`${textStyle.caption} ${sprinkles({ color: "tertiary" })}`}>
            ease-site · duration-base
          </p>
        </div>
        <div className={sprinkles({ display: "flex", flexDirection: "column", gap: "xs" })}>
          {[...Object.entries(vars.motion.ease), ...Object.entries(vars.motion.duration)].map(
            ([name, reference]) => (
              <TokenLabel key={name} name={name} value={reference} />
            ),
          )}
        </div>
      </div>

      <SectionTitle>Layout</SectionTitle>
      <div className={sprinkles({ display: "flex", flexDirection: "column", gap: "xs" })}>
        {Object.entries(vars.layout).map(([name, reference]) => (
          <TokenLabel key={name} name={name} value={reference} />
        ))}
        <TokenLabel name="grid.columns" value={String(grid.columns)} />
        <TokenLabel
          name="breakpoints"
          value={Object.entries(breakpoints)
            .map(([name, px]) => `${name} ${px}px`)
            .join(" · ")}
        />
      </div>
    </main>
  );
}
