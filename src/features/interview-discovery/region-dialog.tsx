"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Tabs } from "@base-ui/react/tabs";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { ArrowLeft, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/button";
import * as styles from "./region-dialog.css";

export type RegionGroup = {
  name: string;
  shortName: string;
  sigungus: Array<{
    name: string;
    sigunguId: number;
  }>;
};

type RegionDialogProps = {
  handle: typeof discoveryRegionDialog;
  onValueChange: (value: number | null) => void;
  regions: RegionGroup[];
  value: number | null;
};

export const discoveryRegionDialog = Dialog.createHandle<void>();

function findSelectedRegion(regions: RegionGroup[], sigunguId: number | null) {
  if (sigunguId === null) return null;

  for (const sido of regions) {
    const sigungu = sido.sigungus.find((item) => item.sigunguId === sigunguId);

    if (sigungu) return { sido, sigungu };
  }

  return null;
}

function getInitialSidoName(regions: RegionGroup[], sigunguId: number | null) {
  return findSelectedRegion(regions, sigunguId)?.sido.name ?? regions[0]?.name ?? null;
}

export function RegionDialog({ handle, onValueChange, regions, value }: RegionDialogProps) {
  const [draftId, setDraftId] = useState<number | null>(value);
  const [activeSidoName, setActiveSidoName] = useState<string | null>(() =>
    getInitialSidoName(regions, value),
  );
  const activeSido = regions.find((sido) => sido.name === activeSidoName) ?? null;
  const selectedRegion = findSelectedRegion(regions, draftId);

  const confirmSelection = () => {
    if (draftId !== value) onValueChange(draftId);
  };

  return (
    <Dialog.Root
      handle={handle}
      onOpenChange={(open) => {
        if (!open) return;

        setDraftId(value);
        setActiveSidoName(getInitialSidoName(regions, value));
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <header className={styles.header}>
            <Dialog.Close aria-label="지역 선택 닫기" className={styles.backButton} type="button">
              <ArrowLeft aria-hidden="true" size={24} strokeWidth={1.75} />
            </Dialog.Close>
            <Dialog.Title className={styles.title}>지역 선택</Dialog.Title>
          </header>

          <Tabs.Root
            className={styles.dialogBody}
            onValueChange={(nextValue) => setActiveSidoName(String(nextValue))}
            orientation="vertical"
            value={activeSidoName}
          >
            <Tabs.List aria-label="시도" className={styles.sidoList}>
              {regions.map((sido) => (
                <Tabs.Tab className={styles.sidoTab} key={sido.name} value={sido.name}>
                  <span>{sido.name}</span>
                  {selectedRegion?.sido.name === sido.name ? (
                    <span aria-label="1개 선택" className={styles.selectedCount}>
                      1
                    </span>
                  ) : null}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            <section className={styles.sigunguSection}>
              {activeSido ? (
                <Tabs.Panel className={styles.sigunguPanel} value={activeSido.name}>
                  <h3 className={styles.sidoTitle}>{activeSido.name}</h3>
                  <ToggleGroup
                    aria-label={`${activeSido.shortName} 시군구`}
                    className={styles.sigunguList}
                    multiple={false}
                    onValueChange={(values) => {
                      const nextValue = values.at(-1);
                      setDraftId(nextValue === undefined ? null : Number(nextValue));
                    }}
                    value={activeSido.sigungus
                      .filter((sigungu) => sigungu.sigunguId === draftId)
                      .map((sigungu) => String(sigungu.sigunguId))}
                  >
                    {activeSido.sigungus.map((sigungu) => (
                      <Toggle
                        className={styles.sigunguToggle}
                        key={sigungu.sigunguId}
                        value={String(sigungu.sigunguId)}
                      >
                        {sigungu.name}
                      </Toggle>
                    ))}
                  </ToggleGroup>
                </Tabs.Panel>
              ) : (
                <p className={styles.emptyState}>선택할 수 있는 지역이 없어요.</p>
              )}
            </section>
          </Tabs.Root>

          <footer className={styles.footer}>
            <div aria-label="선택한 지역" className={styles.selectedRegion}>
              {selectedRegion ? (
                <span className={styles.regionPill}>
                  {selectedRegion.sido.shortName} {selectedRegion.sigungu.name}
                  <button
                    aria-label={`${selectedRegion.sido.shortName} ${selectedRegion.sigungu.name} 선택 해제`}
                    className={styles.removeRegionButton}
                    onClick={() => setDraftId(null)}
                    type="button"
                  >
                    <X aria-hidden="true" size={14} />
                  </button>
                </span>
              ) : null}
            </div>
            <div className={styles.footerActions}>
              <Button
                disabled={draftId === null}
                onClick={() => setDraftId(null)}
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
