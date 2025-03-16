export interface ChartDataItem {
  date: string;
  price: number
}

export interface NewsArticle {
  title: string; // 뉴스 제목
  description: string; // 뉴스 간단한 설명
  date: string; // 뉴스가 작성된 날짜
  url: string;
}
