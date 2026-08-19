"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, X } from "lucide-react";
import { useState, useTransition } from "react";
import {
  createJobPostingMutation,
  jobPostingLinkMetadataMutation,
  searchCompaniesOptions,
} from "@/api/generated/@tanstack/react-query.gen";
import { Button } from "@/components/button";
import type { SelectedPosting } from "./interview-create-model";
import * as styles from "./interview-create-wizard.css";

type Company = { companyId: number; name: string };

export function JobPostingLinkDialog({
  onCreated,
}: {
  onCreated: (posting: SelectedPosting) => void;
}) {
  const queryClient = useQueryClient();
  const metadata = useMutation(jobPostingLinkMetadataMutation());
  const createPosting = useMutation(createJobPostingMutation());
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyQuery, setCompanyQuery] = useState("");
  const [url, setUrl] = useState("");
  const [postingName, setPostingName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSearching, startSearch] = useTransition();

  const reset = () => {
    setCompany(null);
    setCompanies([]);
    setCompanyQuery("");
    setUrl("");
    setPostingName("");
    setError(null);
    metadata.reset();
    createPosting.reset();
  };

  const loadMetadata = async () => {
    if (!company || !/^https?:\/\//.test(url)) {
      setError("회사와 http(s) 공고 링크를 확인해 주세요.");
      return;
    }
    setError(null);
    try {
      const response = await metadata.mutateAsync({ body: { companyId: company.companyId, url } });
      setPostingName(response.data?.postingName ?? "");
    } catch {
      setError("링크 정보를 불러오지 못했어요. 공고명은 직접 입력할 수 있어요.");
      setPostingName("");
    }
  };

  const submit = async () => {
    if (!company || !postingName.trim()) {
      setError("회사와 공고명을 입력해 주세요.");
      return;
    }
    try {
      const response = await createPosting.mutateAsync({
        body: { companyId: company.companyId, postingName: postingName.trim(), url },
      });
      if (!response.data) throw new Error("empty response");
      onCreated({
        companyId: company.companyId,
        companyName: company.name,
        jobPostingId: response.data.jobPostingId,
        postingName: response.data.postingName,
      });
      setOpen(false);
      reset();
    } catch {
      setError("공고를 추가하지 못했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <Dialog.Root
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) reset();
      }}
      open={open}
    >
      <Dialog.Trigger className={styles.inlineLink}>공고 링크로 직접 추가하기</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.dialogBackdrop} />
        <Dialog.Popup className={styles.dialogPopup}>
          <div className={styles.dialogHeader}>
            <div>
              <Dialog.Title className={styles.dialogTitle}>채용 공고 링크 추가</Dialog.Title>
              <Dialog.Description className={styles.dialogDescription}>
                먼저 기존 회사에서 공고가 속한 회사를 찾아 주세요.
              </Dialog.Description>
            </div>
            <Dialog.Close aria-label="닫기" className={styles.iconButton}>
              <X aria-hidden="true" size={18} />
            </Dialog.Close>
          </div>
          {!company ? (
            <div className={styles.dialogBody}>
              <label className={styles.label} htmlFor="link-company-search">
                회사
              </label>
              <input
                className={styles.inputStandalone}
                id="link-company-search"
                onChange={(event) => {
                  const nextQuery = event.target.value;
                  setCompanyQuery(nextQuery);
                  if (!nextQuery.trim()) return setCompanies([]);
                  startSearch(async () => {
                    try {
                      const response = await queryClient.fetchQuery(
                        searchCompaniesOptions({ query: { query: nextQuery.trim() } }),
                      );
                      setCompanies(response.data?.companies ?? []);
                    } catch {
                      setCompanies([]);
                    }
                  });
                }}
                placeholder="회사명 검색"
                value={companyQuery}
              />
              <div aria-busy={isSearching || undefined} className={styles.searchResults}>
                {companies.map((item) => (
                  <button
                    className={styles.searchResult}
                    key={item.companyId}
                    onClick={() => setCompany(item)}
                    type="button"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.dialogBody}>
              <button className={styles.backLink} onClick={() => setCompany(null)} type="button">
                <ArrowLeft aria-hidden="true" size={14} /> {company.name}
              </button>
              <label className={styles.label} htmlFor="posting-url">
                공고 링크
              </label>
              <div className={styles.dialogRow}>
                <input
                  className={styles.inputStandalone}
                  id="posting-url"
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://..."
                  type="url"
                  value={url}
                />
                <Button
                  disabled={metadata.isPending}
                  onClick={loadMetadata}
                  type="button"
                  variant="secondary"
                >
                  불러오기
                </Button>
              </div>
              {metadata.data?.data ? (
                <a
                  className={styles.previewLink}
                  href={metadata.data.data.sourceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  원본 링크 확인 <ExternalLink aria-hidden="true" size={14} />
                </a>
              ) : null}
              <label className={styles.label} htmlFor="posting-name">
                공고명
              </label>
              <input
                className={styles.inputStandalone}
                id="posting-name"
                maxLength={100}
                onChange={(event) => setPostingName(event.target.value)}
                placeholder="공고명을 입력해 주세요"
                value={postingName}
              />
              {error ? <p className={styles.error}>{error}</p> : null}
              <Button disabled={createPosting.isPending} onClick={submit} type="button">
                {createPosting.isPending ? "추가하는 중..." : "공고 추가"}
              </Button>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
