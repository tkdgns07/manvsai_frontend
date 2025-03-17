import { ChartDataItem, ExtraDataSet, FinalData } from "../../../types/type";

export function mergeChartData(
    findata: ChartDataItem[],
    extraDataSets: ExtraDataSet[]
  ): FinalData[] {
    const allDates = new Set<string>();
  
    findata.forEach((item) => {
      if (item.date) allDates.add(item.date);
    });
  
    extraDataSets.forEach((dataset) => {
      dataset.data.forEach((item) => {
        if (item.date) allDates.add(item.date);
      });
    });
  
    const mergedData: FinalData[] = Array.from(allDates).map((date) => {
      const mergedItem: FinalData = { date };
  
      const mainDataItem = findata.find((item) => item.date === date);
      if (mainDataItem) {
        mergedItem["price"] = mainDataItem.price;
      }
  
      extraDataSets.forEach((dataset) => {
        const extraDataItem = dataset.data.find((item) => item.date === date);
        if (extraDataItem) {
          mergedItem[dataset.label] = extraDataItem.price || null;
        } else {
          mergedItem[dataset.label] = null;
        }
      });
  
      return mergedItem;
    });
  
    return mergedData;
  }