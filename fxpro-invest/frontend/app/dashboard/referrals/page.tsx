import { FeaturePage } from '@/components/feature-page';
import { UserResourceTable } from '@/components/user-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Investor" title="Referrals" description="Review referral code activity, commission earnings, and reversed commission history." /><UserResourceTable resource="referrals" title="Referral Commissions" /></>; }
