import { Configs } from "../../types/type";

export const mainChartConfigs: Configs[] = [
  {
    id: "MainGood",
    label: "price",
    color: "var(--chart-red)",
    chartType: false
  },
  {
    id: "MainBad",
    label: "price",
    color: "var(--chart-green)",
    chartType: false
  },
  {
    id: "LSTM1",
    label: "LSTM1",
    color: "var(--chart-LSTM)",
    chartType: false
  },
  {
    id: "LSTM2",
    label: "LSTM2",
    color: "var(--chart-LSTM)",
    chartType: false
  },
  {
    id: "LSTM3",
    label: "LSTM3",
    color: "var(--chart-LSTM)",
    chartType: false
  },
  {
    id: "ARIMA",
    label: "ARIMA",
    color: "var(--chart-ARIMA)",
    chartType: false
  },
];
