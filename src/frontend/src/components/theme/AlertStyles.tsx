export const alertStyles = {
  normal: 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700',
  warning: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700',
  critical: 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700',
};

export function getAlertClassName(severity: 'normal' | 'warning' | 'critical'): string {
  return alertStyles[severity];
}
