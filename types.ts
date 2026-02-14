
export enum PlanType {
  STARTER = 'STARTER',
  QUANT_PRO = 'QUANT_PRO'
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
}

export interface GeneratedCode {
  code: string;
  strategy: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
