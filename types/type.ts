export interface ChartDataItem {
  date: string;
  price: number
}

export interface RawData {
  label: string;
  data: ChartDataItem[];
}

export interface ChartItem {
  date: string;
  label: number | null;
}

export interface TransformedData {
  [key: string]: ChartItem[];
}

export interface FinalData {
  date: string;
  [key: string] : number | string | null;
}

export interface Configs {
  id: string;
  label : string;
  color : string;
  chartType : boolean
}

export interface NewsArticle {
  title: string; // 뉴스 제목
  description: string; // 뉴스 간단한 설명
  pubDate: string; // 뉴스가 작성된 날짜
  link: string;
}

export interface Company {
  symbol: string
  name: string
  logoId: string
}