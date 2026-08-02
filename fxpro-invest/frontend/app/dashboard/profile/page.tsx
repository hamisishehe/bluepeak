import { FeaturePage } from '@/components/feature-page';
import { ProfileForm } from '@/components/profile-form';
export default function Page() { return <><FeaturePage eyebrow="Investor" title="Profile" description="Manage identity information, contact details, and verification status." actions={['Save Profile']} /><ProfileForm /></>; }
