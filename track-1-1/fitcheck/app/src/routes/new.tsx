import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type DragEvent } from "react";
import { FileText, ImagePlus, Loader2, Upload, X, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Page } from "@/components/fit";
import { cn } from "@/lib/utils";
import { sampleJobPreview } from "@/mocks/analyses";

export const Route = createFileRoute("/new")({
  head: () => ({
    meta: [
      { title: "새 분석 · FitCheck" },
      { name: "description", content: "채용공고 링크와 이력서 PDF로 새 적합도 분석을 시작하세요." },
      { property: "og:title", content: "새 분석 · FitCheck" },
      { property: "og:description", content: "채용공고와 이력서로 새 적합도 분석 시작." },
    ],
  }),
  component: NewPage,
});

const IMG_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MB = 1024 * 1024;
type JobState = "idle" | "loading" | "success" | "failed";
type Shot = { id: string; file: File; url: string };

function useDrop(onFiles: (f: File[]) => void) {
  const [over, setOver] = useState(false);
  return {
    over,
    props: {
      onDragOver: (e: DragEvent) => { e.preventDefault(); setOver(true); },
      onDragLeave: () => setOver(false),
      onDrop: (e: DragEvent) => { e.preventDefault(); setOver(false); onFiles(Array.from(e.dataTransfer.files)); },
    },
  };
}

function NewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [job, setJob] = useState<JobState>("idle");
  const [confirmed, setConfirmed] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [shots, setShots] = useState<Shot[]>([]);
  const [shotErrors, setShotErrors] = useState<string[]>([]);
  const [pdf, setPdf] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const imgInput = useRef<HTMLInputElement>(null);
  const pdfInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => shots.forEach((s) => URL.revokeObjectURL(s.url)), []); // eslint-disable-line

  const loadJob = () => {
    if (!/^https?:\/\//i.test(url.trim())) { setUrlError("올바른 링크를 입력해 주세요"); return; }
    setUrlError(""); setJob("loading"); setConfirmed(false); setRejected(false);
    setTimeout(() => setJob(url.includes("fail") ? "failed" : "success"), 1500);
  };

  const addShots = (files: File[]) => {
    const errs: string[] = [];
    const next: Shot[] = [];
    for (const f of files) {
      if (!IMG_TYPES.includes(f.type)) { errs.push(`${f.name}: PNG, JPG, WebP 파일만 올릴 수 있어요`); continue; }
      if (f.size > 3 * MB) { errs.push(`${f.name}: 3MB 이하 파일만 올릴 수 있어요`); continue; }
      if (shots.length + next.length >= 5) { errs.push(`${f.name}: 최대 5장까지 올릴 수 있어요`); continue; }
      next.push({ id: crypto.randomUUID(), file: f, url: URL.createObjectURL(f) });
    }
    setShots((s) => [...s, ...next]);
    setShotErrors(errs);
  };

  const setPdfFile = (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) { setPdfError("PDF 파일만 올릴 수 있어요"); return; }
    if (f.size > 5 * MB) { setPdfError("5MB 이하 파일만 올릴 수 있어요"); return; }
    setPdfError(""); setPdf(f);
  };

  const imgDrop = useDrop(addShots);
  const pdfDrop = useDrop(setPdfFile);
  const showUpload = job === "failed" || rejected;
  const canNext = (job === "success" && confirmed) || shots.length > 0;

  const start = () => {
    if (analyzing) return;
    setAnalyzing(true);
    let p = 0;
    const t = setInterval(() => { p = Math.min(95, p + 4); setProgress(p); }, 100);
    setTimeout(() => { clearInterval(t); setProgress(100); navigate({ to: "/analysis/$id", params: { id: "1" } }); }, 3000);
  };

  return (
    <Page>
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary">{step}/2 단계</p>
        <h1 className="mt-1 text-2xl font-bold">{step === 1 ? "채용공고 입력" : "이력서 첨부"}</h1>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[1, 2].map((n) => (
            <div key={n} className={cn("h-1.5 rounded-full", n <= step ? "bg-primary" : "bg-secondary")} />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <Card className="p-6">
            <Label htmlFor="url">채용공고 링크</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input id="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} aria-invalid={!!urlError} onKeyDown={(e) => e.key === "Enter" && loadJob()} />
              <Button className="w-full sm:w-auto" onClick={loadJob} disabled={job === "loading"}>
                {job === "loading" ? <><Loader2 className="animate-spin" /> 불러오는 중</> : "공고 불러오기"}
              </Button>
            </div>
            {urlError && <p className="text-sm text-destructive">{urlError}</p>}
            <p className="text-xs text-muted-foreground">데모: 링크에 “fail”을 넣으면 불러오기 실패 화면을 볼 수 있어요.</p>
          </Card>

          {job === "success" && !rejected && (
            <Card className={cn("p-6", confirmed && "border-primary")}>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{sampleJobPreview.company}</p>
                <p className="text-lg font-bold">{sampleJobPreview.title}</p>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {sampleJobPreview.requirements.map((r) => <li key={r}>{r}</li>)}
              </ul>
              {confirmed ? (
                <p className="flex items-center gap-2 text-sm font-semibold text-primary"><CheckCircle2 className="h-4 w-4" /> 공고 내용을 확인했어요</p>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="w-full sm:w-auto" onClick={() => setConfirmed(true)}>맞아요</Button>
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => setRejected(true)}>아니에요</Button>
                </div>
              )}
            </Card>
          )}

          {showUpload && (
            <>
              <Alert variant="destructive">
                <AlertDescription>공고 내용을 읽지 못했습니다. 공고 화면을 캡처해서 올려 주세요</AlertDescription>
              </Alert>
              <Card className="p-6">
                <button
                  type="button"
                  {...imgDrop.props}
                  onClick={() => imgInput.current?.click()}
                  className={cn("flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors", imgDrop.over ? "border-primary bg-accent" : "hover:border-primary")}
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="font-medium">캡처 이미지를 끌어다 놓거나 눌러서 선택하세요</span>
                  <span className="text-sm text-muted-foreground">PNG·JPG·WebP, 최대 5장, 장당 3MB</span>
                </button>
                <input ref={imgInput} type="file" multiple accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => { addShots(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
                {shotErrors.length > 0 && (
                  <ul className="space-y-1 text-sm text-destructive">{shotErrors.map((e) => <li key={e}>{e}</li>)}</ul>
                )}
                {shots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {shots.map((s) => (
                      <div key={s.id} className="relative aspect-square overflow-hidden rounded-lg border">
                        <img src={s.url} alt={s.file.name} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          aria-label="삭제"
                          onClick={() => { URL.revokeObjectURL(s.url); setShots((x) => x.filter((y) => y.id !== s.id)); }}
                          className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}

          <Button size="lg" className="w-full" disabled={!canNext} onClick={() => setStep(2)}>다음</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="p-6">
            {pdf ? (
              <div className="flex items-center gap-3 rounded-lg border bg-muted p-4">
                <FileText className="h-8 w-8 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{pdf.name}</p>
                  <p className="text-sm text-muted-foreground">{(pdf.size / MB).toFixed(2)} MB</p>
                </div>
                <Button variant="outline" size="sm" disabled={analyzing} onClick={() => pdfInput.current?.click()}>파일 교체</Button>
              </div>
            ) : (
              <button
                type="button"
                {...pdfDrop.props}
                onClick={() => pdfInput.current?.click()}
                className={cn("flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors", pdfDrop.over ? "border-primary bg-accent" : "hover:border-primary")}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="font-medium">이력서 PDF를 끌어다 놓거나 눌러서 선택하세요</span>
                <span className="text-sm text-muted-foreground">PDF, 5MB 이하</span>
              </button>
            )}
            <input ref={pdfInput} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => { setPdfFile(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
            {pdfError && <p className="text-sm text-destructive">{pdfError}</p>}
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> 이력서 파일은 분석 직후 삭제되며 분석 결과만 저장됩니다
            </p>
          </Card>

          {analyzing && (
            <Card className="p-6">
              <p className="flex items-center gap-2 font-medium"><Loader2 className="h-4 w-4 animate-spin text-primary" /> 분석 중이에요</p>
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">최대 1분 정도 걸릴 수 있어요</p>
            </Card>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="lg" className="w-full sm:w-auto" disabled={analyzing} onClick={() => setStep(1)}>이전</Button>
            <Button size="lg" className="w-full sm:flex-1" disabled={!pdf || analyzing} onClick={start}>
              {analyzing ? "분석 중..." : "분석 시작"}
            </Button>
          </div>
        </div>
      )}
    </Page>
  );
}
