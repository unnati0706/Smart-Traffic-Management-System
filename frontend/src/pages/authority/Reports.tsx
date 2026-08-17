import React, { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import styles from './Reports.module.css';

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('CONGESTION_DAILY');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setDownloadUrl(null);

    setTimeout(() => {
      setIsGenerating(false);
      setDownloadUrl(`report_export_${reportType.toLowerCase()}_2026_08.pdf`);
    }, 1200);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const blob = new Blob(['Smart Traffic Management System - Official Report Content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadUrl;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Authority Executive Report Generator</h1>
        <p className={styles.subtitle}>
          Generate PDF and CSV operational reports for traffic performance and incident logs.
        </p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleGenerate} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Report Category</label>
            <select
              className={styles.select}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="CONGESTION_DAILY">Daily Traffic Congestion & Delay Summary</option>
              <option value="INCIDENT_DISPATCH">Monthly Incident Response & Officer Dispatch Log</option>
              <option value="EMERGENCY_CORRIDOR">Emergency Green Corridor Speedup Audit</option>
              <option value="ENVIRONMENTAL_IMPACT">Environmental Fuel & CO2 Savings Report</option>
            </select>
          </div>

          <div className={styles.dateGrid}>
            <Input label="Start Date" type="date" defaultValue="2026-08-01" />
            <Input label="End Date" type="date" defaultValue="2026-08-14" />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={isGenerating}>
            <FileSpreadsheet size={18} /> {isGenerating ? 'Compiling Report PDF/CSV...' : 'Generate Official Report'}
          </Button>
        </form>

        {downloadUrl && (
          <div className={styles.successBox}>
            <div className={styles.successInfo}>
              <CheckCircle2 color="var(--color-status-normal)" size={24} />
              <div className={styles.successText}>
                <span className={styles.successTitle}>Report Generated Successfully</span>
                <span className={styles.successDesc}>PDF & CSV formats compiled and ready</span>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={handleDownload}>
              <Download size={14} /> Download File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
