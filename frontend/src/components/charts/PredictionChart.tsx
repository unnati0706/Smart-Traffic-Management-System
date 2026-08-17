import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import styles from './PredictionChart.module.css';

interface ChartDataPoint {
  time: string;
  historical?: number;
  predicted?: number;
}

interface PredictionChartProps {
  data?: ChartDataPoint[];
  title?: string;
}

const DEFAULT_DATA: ChartDataPoint[] = [
  { time: '14:00', historical: 120, predicted: 120 },
  { time: '14:15', historical: 180, predicted: 180 },
  { time: '14:30', historical: 240, predicted: 240 },
  { time: '14:45', historical: 310, predicted: 310 },
  { time: '15:00 (Now)', historical: 380, predicted: 380 },
  { time: '15:15 (+15m)', predicted: 430 },
  { time: '15:30 (+30m)', predicted: 490 },
  { time: '16:00 (+60m)', predicted: 350 },
];

export const PredictionChart: React.FC<PredictionChartProps> = ({
  data = DEFAULT_DATA,
  title = '15/30/60 Minute Traffic Demand Prediction',
}) => {
  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              borderColor: '#374151',
              color: '#f9fafb',
            }}
          />
          <Area
            type="monotone"
            dataKey="historical"
            stroke="#2563eb"
            fillOpacity={1}
            fill="url(#colorHist)"
            name="Observed Flow"
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#f59e0b"
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorPred)"
            name="AI Forecast"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
