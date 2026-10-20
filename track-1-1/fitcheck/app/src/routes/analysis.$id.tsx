import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, ExternalLink, ArrowDown, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Page, ScoreBar, ScoreGauge, SectionTitle } from "@/components/fit";
import { DeleteDialog } from "@/components/DeleteDialog";
import { formatDate, store, useAppState } from "@/lib/store";

export const Route = createFileRoute("/analysis/$id")({
  head: () => ({
    meta: [
      { title: "분석 결과 · FitCheck" },
      { name: "description", content: "채용공고 적합도 점수, 부족 역량, 이력서 수정안을 확인하세요." },
      { property: "og:title", content: "분석 결과 · FitCheck" },
      { property: "og:description", content: "적합도 점수와 이력서 문장 수정안." },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const { id } = Route.useParams();
  const { analyses } = useAppState();
  const navigate = useNavigate();
  const a = analyses.find((x) => x.id === id);

  if (!a) {
    return (
      <Page>
        <Card className="items-center p-12 text-center">
          <p className="text-xl font-bold">분석을 찾을 수 없습니다</p>
          <Button asChild className="w-full sm:w-auto"><Link to="/history">목록으로</Link></Button>
        </Card>
      </Page>
    );
  }

  const r = a.result;
  const copy = async (text: string) => {
    await navigator.clipboard?.writeText(text).catch(() => {});
    toast.success("수정안을 복사했어요");
  };

  return (
    <Page>
      <header className="mb-6">
        <p className="text-sm font-semibold text-primary">{a.company}</p>
        <h1 className="mt-1 text-2xl font-bold">{a.title}</h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <a href={a.jobUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
            공고 보기 <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <span>{formatDate(a.createdAt)}</span>
        </div>
      </header>

      {!r ? (
        <Alert variant="destructive">
          <AlertTitle>분석에 실패했습니다</AlertTitle>
          <AlertDescription>공고 또는 이력서를 읽지 못했어요. 새 분석으로 다시 시도해 주세요.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          <Card className="flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
            <ScoreGauge score={r.match_score} />
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-muted-foreground">적합도 점수</p>
              <p className="mt-1 text-xl font-bold">{r.summary}</p>
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle>항목별 점수</SectionTitle>
            <div className="space-y-4">
              <ScoreBar label="필수 자격" value={r.score_breakdown.required_qualifications} max={50} />
              <ScoreBar label="우대 사항" value={r.score_breakdown.preferred_qualifications} max={20} />
              <ScoreBar label="직무 경험" value={r.score_breakdown.experience_relevance} max={20} />
              <ScoreBar label="표현·구성" value={r.score_breakdown.presentation} max={10} />
            </div>
          </Card>

          <Card className="p-6">
            <SectionTitle>보유 역량</SectionTitle>
            <ul className="space-y-4">
              {r.matched_skills.map((m) => (
                <li key={m.skill}>
                  <p className="font-bold">{m.skill}</p>
                  <blockquote className="mt-1.5 border-l-4 border-primary bg-accent/60 py-2 pl-4 pr-3 text-sm text-muted-foreground">
                    “{m.evidence}”
                  </blockquote>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <SectionTitle>부족 역량</SectionTitle>
            <ul className="divide-y">
              {r.missing_skills.map((m) => (
                <li key={m.skill} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{m.skill}</p>
                    <Badge variant={m.importance === "required" ? "destructive" : "secondary"}>
                      {m.importance === "required" ? "필수" : "우대"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{m.suggestion}</p>
                </li>
              ))}
            </ul>
          </Card>

          <section>
            <SectionTitle>문장 수정안</SectionTitle>
            <div className="space-y-4">
              {r.resume_suggestions.map((s, i) => (
                <Card key={i} className="p-6">
                  <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
                    <div className="rounded-lg bg-secondary p-4">
                      <p className="mb-1 text-xs font-semibold text-muted-foreground">원문</p>
                      <p className="text-muted-foreground">{s.original}</p>
                    </div>
                    <div className="flex items-center justify-center text-primary">
                      <ArrowDown className="md:hidden" /><ArrowRight className="hidden md:block" />
                    </div>
                    <div className="rounded-lg border border-primary/40 bg-accent p-4">
                      <p className="mb-1 text-xs font-semibold text-primary">수정안</p>
                      <p className="font-medium">{s.revised}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground"><b className="text-foreground">이유</b> · {s.reason}</p>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => copy(s.revised)}>
                      <Copy /> 수정안 복사
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild><Link to="/history">목록으로</Link></Button>
        <Button size="lg" className="w-full sm:w-auto" asChild><Link to="/new">새 분석</Link></Button>
        <DeleteDialog
          onConfirm={() => { store.remove(a.id); toast.success("삭제했습니다"); navigate({ to: "/history" }); }}
          trigger={<Button variant="ghost" size="lg" className="w-full text-destructive sm:ml-auto sm:w-auto">삭제</Button>}
        />
      </div>
    </Page>
  );
}
