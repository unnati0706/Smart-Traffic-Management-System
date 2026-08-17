import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Dialog } from '../../components/ui/Dialog/Dialog';
import { incidentsService } from '../../services/api/incidents';
import styles from './ReportIncident.module.css';

const incidentSchema = z.object({
  type: z.string().min(1, 'Please select incident type'),
  address: z.string().min(5, 'Location address must be at least 5 characters'),
  description: z.string().min(15, 'Please provide a detailed description (min 15 characters)'),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

export const ReportIncident: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{ id: string; timestamp: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      type: 'ACCIDENT',
      address: '',
      description: '',
    },
  });

  const onSubmit = async (data: IncidentFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('address', data.address);
      formData.append('description', data.description);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await incidentsService.submitCitizenReport(formData);
      setConfirmationData({ id: response.id, timestamp: response.timestamp });
      reset();
      setSelectedFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Report Road Incident</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Incident Type</label>
            <select className={styles.select} {...register('type')}>
              <option value="ACCIDENT">Traffic Accident</option>
              <option value="CONSTRUCTION">Road Construction / Maintenance</option>
              <option value="ROAD_CLOSURE">Road Block / Closure</option>
              <option value="HAZARD">Debris / Debris Hazard</option>
              <option value="OTHER">Other Obstruction</option>
            </select>
            {errors.type && <span className={styles.errorText}>{errors.type.message}</span>}
          </div>

          <Input
            label="Location Address"
            placeholder="e.g. 5th Main Flyover Ramp, Near Metro Station"
            error={errors.address?.message}
            {...register('address')}
          />

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Detailed Description</label>
            <textarea
              className={styles.textarea}
              placeholder="Describe vehicles involved, lanes blocked, or specific hazards..."
              {...register('description')}
            />
            {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Attach Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="file-upload-input"
              onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
            />
            <label htmlFor="file-upload-input">
              <Button type="button" variant="secondary" size="sm" onClick={() => document.getElementById('file-upload-input')?.click()}>
                <Upload size={16} />
                {selectedFile ? selectedFile.name : 'Choose Image File (JPG/PNG)'}
              </Button>
            </label>
          </div>

          <div className={styles.privacyNotice}>
            <AlertCircle size={16} /> Location information is collected strictly to verify traffic incident reports and optimize dispatch responses.
          </div>

          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Report...' : 'Submit Incident Report'}
          </Button>
        </form>
      </div>

      <Dialog
        open={!!confirmationData}
        onOpenChange={(open) => !open && setConfirmationData(null)}
        title="Incident Report Submitted"
        description="Your report has been dispatched to Traffic Command Center dispatch queue."
      >
        {confirmationData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', textAlign: 'center', alignItems: 'center' }}>
            <CheckCircle2 size={48} color="var(--color-status-normal)" />
            <div>
              <div style={{ fontSize: 'var(--font-size-label)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                Unique Report Tracking ID
              </div>
              <div style={{ fontSize: 'var(--font-size-title)', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>
                {confirmationData.id}
              </div>
            </div>
            <Button variant="primary" onClick={() => setConfirmationData(null)}>
              Done
            </Button>
          </div>
        )}
      </Dialog>
    </div>
  );
};
