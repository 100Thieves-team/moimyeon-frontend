import { style } from "@vanilla-extract/css";
import { vars } from "@/styles";

export const paragraphs = style({ display: "flex", flexDirection: "column", gap: vars.spacing.xl });
export const paragraph = style({ display: "flex", flexDirection: "column", gap: vars.spacing.md });
