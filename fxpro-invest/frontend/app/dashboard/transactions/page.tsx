import { FeaturePage } from '@/components/feature-page';
import { UserResourceTable } from '@/components/user-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Investor" title="Transactions" description="Audit your deposit, investment, profit, withdrawal, referral, and reversal ledger entries." /><UserResourceTable resource="transactions" title="Transaction History" /></>; }
