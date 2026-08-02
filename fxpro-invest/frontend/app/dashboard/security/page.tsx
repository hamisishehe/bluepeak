import { FeaturePage } from '@/components/feature-page';
import { SecurityForm } from '@/components/security-form';
export default function Page() { return <><FeaturePage eyebrow="Investor" title="Security" description="Manage password, active sessions, account protection, and recovery settings." actions={['Change Password']} /><SecurityForm /></>; }
