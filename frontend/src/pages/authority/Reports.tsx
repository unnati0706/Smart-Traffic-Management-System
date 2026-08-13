import React, { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';

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
      setDownloadUrl('report_export_2026_08.pdf');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '680px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold' }}>Authority Executive Report Generator</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Generate PDF and CSV operational reports for traffic performance and incident logs.
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', padding: 'var(--space-6)' }}>
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: 'var(--font-size-label)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Report Category
            </label>
            <select
              style={{ backgroundColor: 'var(--color-bg-input)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', padding: 'var(--space-3)', borderRadius: 'var(--border-radius-md)' }}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="CONGESTION_DAILY">Daily Traffic Congestion & Delay Summary</option>
              <option value="INCIDENT_DISPATCH">Monthly Incident Response & Officer Dispatch Log</option>
              <option value="EMERGENCY_CORRIDOR">Emergency Green Corridor Speedup Audit</option>
              <option value="ENVIRONMENTAL_IMPACT">Environmental Fuel & CO2 Savings Report</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Start Date" type="date" defaultValue="2026-08-01" />
            <Input label="End Date" type="date" defaultValue="2026-08-13" />
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={isGenerating}>
            <FileSpreadsheet size={18} /> {isGenerating ? 'Compiling Report PDF/CSV...' : 'Generate Official Report'}
          </Button>
        </form>

        {downloadUrl && (
          <div style={{ marginTop: 'var(--space-6)', backgroundColor: 'var(--color-bg-surface-hover)', border: '1px solid var(--color-status-normal)', borderRadius: 'var(--border-radius-sm)', padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <CheckCircle2 color="var(--color-status-normal)" size={24} />
              <div>
                <strong>Report Generated Successfully</strong>
                <div style={{ fontSize: 'var(--font-size-metadata)', color: 'var(--color-text-secondary)' }}>PDF & CSV formats ready</div>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={() => alert('Download triggered!')}>
              <Download size={14} /> Download File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
