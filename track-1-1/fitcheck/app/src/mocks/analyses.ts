export type AnalysisStatus = "done" | "running" | "failed";

export interface AnalysisResult {
  summary: string;
  match_score: number;
  score_breakdown: {
    required_qualifications: number;
    preferred_qualifications: number;
    experience_relevance: number;
    presentation: number;
  };
  matched_skills: { skill: string; evidence: string }[];
  missing_skills: { skill: string; importance: "required" | "preferred"; suggestion: string }[];
  resume_suggestions: { original: string; revised: string; reason: string }[];
}

export interface AnalysisRecord {
  id: string;
  company: string;
  title: string;
  jobUrl: string;
  createdAt: string;
  status: AnalysisStatus;
  result: AnalysisResult | null;
}

export const mockAnalyses: AnalysisRecord[] = [
  {
    id: "1",
    company: "토스",
    title: "프론트엔드 개발자 (Frontend Developer)",
    jobUrl: "https://toss.im/career/job-detail?job_id=1234",
    createdAt: "2026-10-20T13:40:00+09:00",
    status: "done",
    result: {
      summary: "React 경험은 충분하지만 TypeScript 실무 경험과 성과 수치가 부족해요.",
      match_score: 72,
      score_breakdown: {
        required_qualifications: 35,
        preferred_qualifications: 12,
        experience_relevance: 17,
        presentation: 8,
      },
      matched_skills: [
        { skill: "React", evidence: "React 기반 사내 관리자 대시보드를 설계·개발하여 20개 이상의 화면을 운영했습니다." },
        { skill: "상태 관리", evidence: "React Query를 도입해 서버 상태와 클라이언트 상태를 분리했습니다." },
        { skill: "협업", evidence: "디자이너·백엔드 개발자와 2주 단위 스프린트로 협업했습니다." },
      ],
      missing_skills: [
        { skill: "TypeScript 실무 경험", importance: "required", suggestion: "개인 프로젝트를 TypeScript로 전환하고, 타입 설계 경험을 이력서에 구체적으로 적어 보세요." },
        { skill: "테스트 코드 작성", importance: "required", suggestion: "Vitest·Testing Library로 주요 컴포넌트 테스트를 작성한 경험을 추가해 보세요." },
        { skill: "웹 성능 최적화", importance: "preferred", suggestion: "Lighthouse 점수 개선 등 측정 가능한 최적화 사례를 정리해 보세요." },
      ],
      resume_suggestions: [
        {
          original: "관리자 페이지를 개발했습니다.",
          revised: "React와 React Query로 관리자 대시보드 20여 개 화면을 개발해 운영팀 업무 처리 시간을 30% 줄였습니다.",
          reason: "사용 기술과 성과 수치를 함께 적으면 기여도가 분명해집니다.",
        },
        {
          original: "팀원들과 열심히 협업했습니다.",
          revised: "디자이너·백엔드 개발자와 2주 스프린트로 협업하며 공통 UI 컴포넌트 15종을 정리했습니다.",
          reason: "추상적인 표현 대신 협업 방식과 결과물을 보여 주세요.",
        },
        {
          original: "새로운 기술을 공부하는 것을 좋아합니다.",
          revised: "TypeScript를 학습해 개인 프로젝트 3개를 전환하고, 런타임 오류를 절반 이하로 줄였습니다.",
          reason: "공고의 필수 역량과 연결된 학습 결과를 드러내면 설득력이 높아집니다.",
        },
      ],
    },
  },
  {
    id: "2",
    company: "당근",
    title: "웹 프론트엔드 엔지니어",
    jobUrl: "https://about.daangn.com/jobs/5678",
    createdAt: "2026-10-19T10:15:00+09:00",
    status: "done",
    result: {
      summary: "필수 자격을 대부분 갖췄고, 서비스 운영 경험이 강점이에요.",
      match_score: 85,
      score_breakdown: {
        required_qualifications: 45,
        preferred_qualifications: 18,
        experience_relevance: 14,
        presentation: 8,
      },
      matched_skills: [
        { skill: "TypeScript", evidence: "TypeScript로 결제 화면을 리팩터링하여 타입 오류를 사전에 차단했습니다." },
        { skill: "Next.js", evidence: "Next.js 기반 커머스 웹을 SSR로 전환해 첫 화면 로딩을 1.2초 단축했습니다." },
      ],
      missing_skills: [
        { skill: "대규모 트래픽 경험", importance: "preferred", suggestion: "동시 접속자 규모나 트래픽 대응 경험이 있다면 숫자로 적어 보세요." },
        { skill: "모바일 웹뷰", importance: "preferred", suggestion: "앱 내 웹뷰 개발 경험을 짧게라도 추가해 보세요." },
      ],
      resume_suggestions: [
        {
          original: "SSR을 적용했습니다.",
          revised: "Next.js SSR 전환으로 첫 화면 로딩을 1.2초 단축하고 이탈률을 12% 낮췄습니다.",
          reason: "기술 적용 결과를 비즈니스 지표와 연결하세요.",
        },
        {
          original: "결제 기능을 맡았습니다.",
          revised: "결제 화면을 TypeScript로 리팩터링해 결제 관련 장애 문의를 월 40건에서 5건으로 줄였습니다.",
          reason: "담당 업무보다 해결한 문제와 결과를 강조하세요.",
        },
        {
          original: "코드 리뷰에 참여했습니다.",
          revised: "주 2회 코드 리뷰를 주도하며 팀 공통 코딩 규칙 문서를 만들었습니다.",
          reason: "주도적인 역할을 드러내면 시니어 역량을 보여 줄 수 있어요.",
        },
      ],
    },
  },
  {
    id: "3",
    company: "카카오",
    title: "데이터 엔지니어",
    jobUrl: "https://careers.kakao.com/jobs/P-9012",
    createdAt: "2026-10-17T16:30:00+09:00",
    status: "done",
    result: {
      summary: "직무와 관련된 경험이 적어 필수 자격 보완이 필요해요.",
      match_score: 45,
      score_breakdown: {
        required_qualifications: 22,
        preferred_qualifications: 6,
        experience_relevance: 11,
        presentation: 6,
      },
      matched_skills: [
        { skill: "SQL", evidence: "SQL로 주간 매출 리포트를 자동화했습니다." },
      ],
      missing_skills: [
        { skill: "Spark·Hadoop", importance: "required", suggestion: "공개 데이터셋으로 Spark 배치 파이프라인을 만들어 보세요." },
        { skill: "데이터 파이프라인 설계", importance: "required", suggestion: "Airflow로 작업 흐름을 구성한 사례를 정리해 보세요." },
        { skill: "클라우드 데이터 웨어하우스", importance: "preferred", suggestion: "BigQuery 등 사용 경험을 추가해 보세요." },
      ],
      resume_suggestions: [
        {
          original: "데이터를 다뤄 본 경험이 있습니다.",
          revised: "SQL로 주간 매출 리포트를 자동화해 수작업 시간을 주 4시간 줄였습니다.",
          reason: "모호한 표현 대신 구체적인 작업과 효과를 적으세요.",
        },
        {
          original: "엑셀을 잘 다룹니다.",
          revised: "Python(pandas)으로 엑셀 기반 정산 업무를 스크립트화했습니다.",
          reason: "직무에 맞는 도구 중심으로 표현을 바꾸세요.",
        },
        {
          original: "분석 업무를 보조했습니다.",
          revised: "마케팅팀 지표 대시보드용 데이터 마트를 설계하고 매일 갱신되도록 구성했습니다.",
          reason: "보조 역할이라도 직접 만든 결과물을 중심으로 서술하세요.",
        },
      ],
    },
  },
  {
    id: "4",
    company: "네이버",
    title: "백엔드 개발자 (신입)",
    jobUrl: "https://recruit.navercorp.com/rcrt/view.do?annoId=3456",
    createdAt: "2026-10-15T09:05:00+09:00",
    status: "failed",
    result: null,
  },
];

export const sampleJobPreview = {
  company: "토스",
  title: "프론트엔드 개발자 (Frontend Developer)",
  requirements: [
    "React 기반 웹 서비스 개발 경험 3년 이상",
    "TypeScript를 활용한 실무 경험",
    "테스트 코드 작성과 코드 리뷰 문화에 익숙하신 분",
  ],
};

export const DAILY_LIMIT = 10;
export const DAILY_REMAINING = 7;
