import { RawData, FinalData } from "../../../types/type";

export default function mergeChartData(dataSets: RawData[]): FinalData[] {
  const allDates = new Set<string>();

  // 모든 날짜를 수집
  dataSets.forEach((dataset) =>
    dataset.data.forEach((item) => allDates.add(item.date))
  );

  // 정렬
  const sortedDates = Array.from(allDates).sort();

  // 데이터 병합
  const mergedData: FinalData[] = [];

  let lastPrice: number | null = null;
  let priceEnded = false;

  sortedDates.forEach((date) => {
    const mergedItem: FinalData = { date };

    dataSets.forEach((dataset) => {
      const dataItem = dataset.data.find((item) => item.date === date);
      if (dataItem) {
        mergedItem[dataset.label] = dataItem.price;
        priceEnded = true
        if (dataset.label === "price" && dataItem.price !== null) {
          lastPrice = dataItem.price;
          priceEnded = false;
        }
      } else {
        mergedItem[dataset.label] = null;
      }
    });

    if (lastPrice && priceEnded) {
      Object.keys(mergedItem).forEach((key) => {
        if (key !== "date") mergedItem[key] = lastPrice;
      });
      lastPrice = null
    }

    mergedData.push(mergedItem);
  });

  return mergedData;
}
