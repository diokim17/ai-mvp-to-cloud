import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Link2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Page, ScoreGauge } from "@/components/fit";
import { mockAnalyses } from "@/mocks/analyses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FitCheck — 채용공고와 내 이력서, 얼마나 맞을까요?" },
      { name: "description", content: "채용공고와 이력서 PDF를 AI로 비교해 적합도 점수, 부족 역량, 문장 수정안을 알려 드려요." },
      { property: "og:title", content: "FitCheck — 채용공고 × 이력서 적합도 분석" },
      { property: "og:description", content: "적합도 점수, 부족 역량, 이력서 문장 수정안을 한 번에." },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: Link2, title: "공고 링크 붙여넣기", desc: "지원할 채용공고 주소를 입력해요" },
  { icon: FileText, title: "이력서 PDF 첨부", desc: "내 이력서 파일을 올려요" },
  { icon: BarChart3, title: "결과 확인", desc: "점수와 수정안을 받아 봐요" },
];

function Index() {
  const sample = mockAnalyses[0]!.result!;
  const tip = sample.resume_suggestions[0]!;
  return (
    <Page>
      <section className="py-6 text-center sm:py-10">
        <Badge variant="secondary" className="mb-4">AI 이력서 적합도 분석</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          채용공고와 내 이력서,<br className="sm:hidden" /> 얼마나 맞을까요?
        </h1>
        <p className="mt-3 text-muted-foreground">공고와 이력서를 비교해 점수와 고칠 점을 알려 드려요.</p>
        <Button size="lg" className="mt-8 w-full sm:w-auto" asChild>
          <Link to="/login">시작하기 <ArrowRight /></Link>
        </Button>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold">사용 방법</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title} className="flex flex-row items-center gap-4 p-5 sm:flex-col sm:items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">{i + 1}단계</p>
                <p className="font-bold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Card>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold">샘플 분석 결과</h2>
        <Card className="gap-0 p-0">
          <div className="flex flex-col items-center gap-5 border-b p-6 sm:flex-row">
            <ScoreGauge score={sample.match_score} size={120} />
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">토스 · 프론트엔드 개발자</p>
              <p className="mt-1 text-lg font-bold">{sample.summary}</p>
            </div>
          </div>
          <div className="border-b p-6">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">부족 역량</p>
            <div className="flex flex-wrap gap-2">
              {sample.missing_skills.slice(0, 2).map((m) => (
                <Badge key={m.skill} variant="outline" className="text-sm">{m.skill}</Badge>
              ))}
            </div>
          </div>
          <div className="p-6">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">문장 수정안</p>
            <p className="text-muted-foreground line-through">{tip.original}</p>
            <p className="mt-2 font-medium">{tip.revised}</p>
          </div>
        </Card>
      </section>
    </Page>
  );
}
