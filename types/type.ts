export interface ChartDataItem {
  date: string;
  price: number | null
}

export interface ExtraDataSet {
  label: string;
  style: string;
  data: ChartDataItem[];
}

export interface FinalData {
  date: string;
  [key: string] : number | string | null;
}

export interface Configs {
  label : string;
  color : string;
  chartType : boolean
}

export interface NewsArticle {
  title: string; // 뉴스 제목
  description: string; // 뉴스 간단한 설명
  date: string; // 뉴스가 작성된 날짜
  url: string;
}
