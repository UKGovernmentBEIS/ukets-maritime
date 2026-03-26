import { SubTaskListMap } from '@shared/types';

export const complianceMonitoringReportingMap: SubTaskListMap<{
  accuracyCompliant: string;
  completenessCompliant: string;
  cct: string;
  consistencyCompliant: string;
  comparabilityCompliant: string;
  transparencyCompliant: string;
  integrityCompliant: string;
}> = {
  title: 'Compliance with monitoring and reporting principles',
  caption: 'Compliance with monitoring and reporting principles',
  accuracyCompliant: {
    title: 'Accuracy',
    caption: 'Accuracy of report',
  },
  completenessCompliant: {
    title: 'Completeness',
    caption: 'Completeness of report',
  },
  cct: { title: 'Consistency, comparability and transparency' },
  consistencyCompliant: { title: 'Consistency' },
  comparabilityCompliant: { title: 'Comparability over time' },
  transparencyCompliant: { title: 'Transparency' },
  integrityCompliant: {
    title: 'Integrity of methodology',
    caption: 'Integrity',
  },
};
