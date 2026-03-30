export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tools: string[];
  image: string;
  location: string;
  coordinates?: [number, number];
  detailPage?: string;
  downloadEnabled?: boolean;
  download?: string;
  video?: string;
  github?: string;
  contextAndIntroduction?: string;
  methodology?: string;
  keyFindings?: string;
  conclusion?: string;
  descriptionPdf?: string;
}

export interface Experience {
  title: string;
  organization: string;
  period: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  focus?: string;
}
