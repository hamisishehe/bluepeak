import { FeaturePage } from '@/components/feature-page';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Admin" title="Referrals" description="View referral commission activity, referred investors, and reversal history." /><AdminResourceTable resource="referrals" title="Referral Commissions" /></>; }
