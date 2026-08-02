import { AdminSettingsForm } from '@/components/admin-settings-form';
import { FeaturePage } from '@/components/feature-page';
export default function Page() { return <><FeaturePage eyebrow="Super Admin" title="System Settings" description="Manage deposit limits, return timing, withdrawal settings, supported networks, and maintenance mode." actions={['Save Settings']} /><AdminSettingsForm /></>; }
