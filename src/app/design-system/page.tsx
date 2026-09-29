import { Button, LinkButton } from "@/components/button";
import { breakpoints, grid, sprinkles, textStyle, vars } from "@/styles";
import { desktopTypeValues, sizeValues, typeValues } from "@/styles/tokens";
import type { Metadata } from "next";
import * as styles from "./page.css";

export const metadata: Metadata = {
  title: "Design System Foundation",
};

const SAMPLE_TEXT = "모이면에서 가볍게 만나요 — Aa Gg 0123";
const BUTTON_VARIANTS = ["primary", "secondary", "ghost"] as const;
const BUTTON_SIZES = ["sm", "md", "lg"] as const;

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
        DESIGN.md 파운데이션 토큰의 Vanilla Extract 구현을 검증하는 페이지입니다. 시스템 설정과
        관계없이 라이트모드를 사용합니다.
      </p>

      <div
        className={sprinkles({ display: "flex", alignItems: "center", gap: "sm", marginTop: "lg" })}
      >
        <div className={styles.ruler} />
        <span className={textStyle.caption}>1.6rem ruler — 정확히 16px이어야 함</span>
      </div>

      <SectionTitle>제품 화면 타이포그래피</SectionTitle>
      <p className={textStyle.bodySm}>크기 / 행간 · rem 기준 · 데스크톱은 800px부터 적용됩니다.</p>
      <div className={styles.metricsTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>용도</th>
              <th>모바일</th>
              <th>데스크톱</th>
              <th>미리보기</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(typeValues).map(([name, mobile]) => {
              const desktop = { ...typeValues, ...desktopTypeValues }[
                name as keyof typeof typeValues
              ];
              return (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>
                    {mobile.fontSize} / {mobile.lineHeight}
                  </td>
                  <td>
                    {desktop.fontSize} / {desktop.lineHeight}
                  </td>
                  <td>
                    <span className={textStyle[name as keyof typeof typeValues]}>모이면 Aa</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <SectionTitle>UI 치수</SectionTitle>
      <div className={styles.componentExamples}>
        {Object.entries(sizeValues).map(([name, value]) => (
          <TokenLabel key={name} name={name} value={value} />
        ))}
      </div>
      <label className={styles.inputExample}>
        <span className={textStyle.fieldLabel}>기본 입력 · 4.8rem</span>
        <input className={styles.inputSpecimen} readOnly value="모이면에서 함께 준비해요" />
      </label>

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

      <section id="button">
        <SectionTitle>Components — Button</SectionTitle>
        <div className={styles.componentGrid}>
          {BUTTON_VARIANTS.map((variant) => (
            <div className={styles.componentRow} key={variant}>
              <span className={styles.componentLabel}>{variant}</span>
              <div className={styles.componentExamples}>
                {BUTTON_SIZES.map((size) => (
                  <Button key={size} size={size} variant={variant}>
                    Button {size}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.componentRow}>
            <span className={styles.componentLabel}>disabled</span>
            <div className={styles.componentExamples}>
              <Button disabled focusableWhenDisabled>
                Disabled
              </Button>
            </div>
          </div>
          <div className={styles.componentRow}>
            <span className={styles.componentLabel}>link</span>
            <div className={styles.componentExamples}>
              {BUTTON_VARIANTS.map((variant) => (
                <LinkButton href="/design-system#button" key={variant} variant={variant}>
                  LinkButton
                </LinkButton>
              ))}
            </div>
          </div>
        </div>
      </section>

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
