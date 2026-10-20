import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Page } from "@/components/fit";
import { store } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "로그인 · FitCheck" },
      { name: "description", content: "FitCheck에 로그인하거나 회원가입하세요." },
      { property: "og:title", content: "로그인 · FitCheck" },
      { property: "og:description", content: "FitCheck에 로그인하거나 회원가입하세요." },
    ],
  }),
  component: LoginPage,
});

const emailSchema = z.string().trim().email();

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState<{ email?: string; pw?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!emailSchema.safeParse(email).success) next.email = "올바른 이메일 형식이 아닙니다";
    if (pw.length < 8) next.pw = "비밀번호는 8자 이상이어야 합니다";
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      store.login();
      navigate({ to: "/history" });
    }, 600);
  };

  return (
    <Page>
      <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{mode === "login" ? "다시 오셨네요" : "FitCheck 시작하기"}</h1>
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>
        </Tabs>
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw">비밀번호</Label>
            <Input id="pw" type="password" placeholder="8자 이상" value={pw} onChange={(e) => setPw(e.target.value)} aria-invalid={!!errors.pw} />
            {errors.pw && <p className="text-sm text-destructive">{errors.pw}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "잠시만요..." : mode === "login" ? "로그인" : "회원가입"}
          </Button>
        </form>
      </Card>
    </Page>
  );
}
