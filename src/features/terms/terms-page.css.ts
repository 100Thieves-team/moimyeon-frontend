import { globalStyle, style } from "@vanilla-extract/css";
import { vars, textMetrics } from "@/styles";

export const page = style({
  minHeight: "100dvh",
  padding: `${vars.layout.pageTop} ${vars.layout.sidePadding} max(${vars.spacing.section}, env(safe-area-inset-bottom))`,
  backgroundColor: vars.color.background,
  color: vars.color.primary,
});

export const article = style({
  width: "100%",
  maxWidth: vars.layout.documentMaxWidth,
  margin: "0 auto",
});

export const title = style({
  ...textMetrics.pageTitle,
  fontWeight: 400,

  letterSpacing: "-0.035em",
});

export const meta = style({
  marginTop: vars.spacing.md,
  color: vars.color.tertiary,
  ...textMetrics.metadata,
});

export const content = style({
  marginTop: vars.layout.sectionGap,
  color: vars.color.secondary,
  ...textMetrics.body,

  wordBreak: "keep-all",
  overflowWrap: "anywhere",
});

globalStyle(`${content} > * + *`, {
  marginTop: vars.spacing.base,
});

globalStyle(`${content} :is(h2, h3, h4, h5, h6)`, {
  marginTop: vars.layout.sectionGap,
  marginBottom: vars.spacing.base,
  color: vars.color.primary,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  ...textMetrics.sectionTitle,
});

globalStyle(`${content} :is(h3, h4, h5, h6)`, {
  ...textMetrics.cardTitle,
});

globalStyle(`${content} > :first-child`, {
  marginTop: 0,
});

globalStyle(`${content} :is(ol, ul)`, {
  paddingInlineStart: vars.spacing.xl,
});

globalStyle(`${content} li + li, ${content} li > :is(p, ol, ul) + *`, {
  marginTop: vars.spacing.sm,
});

globalStyle(`${content} li::marker`, {
  color: vars.color.primary,
});

globalStyle(`${content} strong`, {
  color: vars.color.primary,
  fontWeight: 600,
});

globalStyle(`${content} a`, {
  color: vars.color.primary,
  textDecoration: "underline",
  textUnderlineOffset: "0.15em",
});

globalStyle(`${content} a:focus-visible`, {
  outline: `2px solid ${vars.color.primary}`,
  outlineOffset: 2,
  borderRadius: "0.2rem",
});

globalStyle(`${content} blockquote`, {
  padding: `${vars.spacing.base} ${vars.spacing.lg}`,
  borderInlineStart: `3px solid ${vars.color.strokeMedium}`,
  backgroundColor: vars.color.fillTertiary,
  borderRadius: vars.radius.control,
});

globalStyle(`${content} blockquote > * + *`, {
  marginTop: vars.spacing.sm,
});

globalStyle(`${content} code`, {
  padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
  borderRadius: vars.radius.control,
  backgroundColor: vars.color.fillTertiary,
  fontFamily: vars.font.mono,
  ...textMetrics.bodySm,
});

export const tableScroll = style({
  maxWidth: "100%",
  overflowX: "auto",
  border: `1px solid ${vars.color.strokeMedium}`,
  borderRadius: vars.radius.control,
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: 2,
    },
  },
});

globalStyle(`${tableScroll} table`, {
  width: "100%",
  borderCollapse: "collapse",
  ...textMetrics.bodySm,
});

globalStyle(`${tableScroll} :is(th, td)`, {
  minWidth: "12rem",
  padding: `${vars.spacing.md} ${vars.spacing.base}`,
  textAlign: "start",
  verticalAlign: "top",
  borderBottom: `1px solid ${vars.color.strokeLight}`,
});

globalStyle(`${tableScroll} th`, {
  color: vars.color.primary,
  fontWeight: 600,
  backgroundColor: vars.color.fillSecondary,
});

globalStyle(`${tableScroll} :is(th, td) + :is(th, td)`, {
  borderInlineStart: `1px solid ${vars.color.strokeLight}`,
});

globalStyle(`${tableScroll} tbody tr:last-child td`, {
  borderBottom: 0,
});
