import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2, FileSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Page, ScoreBadge } from "@/components/fit";
import { DeleteDialog } from "@/components/DeleteDialog";
import { formatDate, store, useAppState } from "@/lib/store";
import { DAILY_LIMIT, DAILY_REMAINING, type AnalysisStatus } from "@/mocks/analyses";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "내 분석 기록 · FitCheck" },
      { name: "description", content: "지금까지의 채용공고 적합도 분석 기록을 확인하세요." },
      { property: "og:title", content: "내 분석 기록 · FitCheck" },
      { property: "og:description", content: "지금까지의 채용공고 적합도 분석 기록." },
    ],
  }),
  component: HistoryPage,
});

const statusLabel: Record<AnalysisStatus, string> = { done: "완료", running: "진행 중", failed: "실패" };

function HistoryPage() {
  const { analyses } = useAppState();
  const navigate = useNavigate();
  const list = [...analyses].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <Page>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">내 분석 기록</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            오늘 남은 분석 횟수 <b className="text-primary">{DAILY_REMAINING}/{DAILY_LIMIT}</b>
          </p>
        </div>
        <Button size="lg" className="w-full sm:w-auto" asChild>
          <Link to="/new"><Plus /> 새 분석</Link>
        </Button>
      </div>

      {list.length === 0 ? (
        <Card className="items-center p-12 text-center">
          <FileSearch className="h-10 w-10 text-muted-foreground" />
          <p className="font-medium">아직 분석 기록이 없습니다</p>
          <Button className="w-full sm:w-auto" asChild><Link to="/new"><Plus /> 새 분석</Link></Button>
        </Card>
      ) : (
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.id}>
              <Card
                role="link"
                tabIndex={0}
                onClick={() => navigate({ to: "/analysis/$id", params: { id: a.id } })}
                onKeyDown={(e) => e.key === "Enter" && navigate({ to: "/analysis/$id", params: { id: a.id } })}
                className="cursor-pointer flex-row items-center gap-4 p-5 transition-colors hover:border-primary"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">{a.company}</span>
                    <Badge variant={a.status === "failed" ? "destructive" : "secondary"}>{statusLabel[a.status]}</Badge>
                  </div>
                  <p className="mt-1 truncate font-bold">{a.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatDate(a.createdAt)}</p>
                </div>
                {a.result && <ScoreBadge score={a.result.match_score} />}
                <DeleteDialog
                  onConfirm={() => { store.remove(a.id); toast.success("삭제했습니다"); }}
                  trigger={
                    <Button variant="ghost" size="icon" aria-label="삭제" onClick={(e) => e.stopPropagation()}>
                      <Trash2 />
                    </Button>
                  }
                />
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
