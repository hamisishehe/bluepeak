import { FeaturePage } from '@/components/feature-page';
import { ProfileForm } from '@/components/profile-form';
import { SecurityForm } from '@/components/security-form';
export default function Page() { return <><FeaturePage eyebrow="Admin" title="Admin Profile" description="Manage administrator profile, password, and session security." actions={['Save Profile', 'Change Password']} /><ProfileForm /><SecurityForm /></>; }
