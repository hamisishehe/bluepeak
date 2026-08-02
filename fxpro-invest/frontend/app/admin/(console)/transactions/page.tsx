import { FeaturePage } from '@/components/feature-page';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Admin" title="Transactions" description="Inspect financial ledger entries for deposits, investments, profits, withdrawals, referrals, and reversals." /><AdminResourceTable resource="transactions" title="Ledger Entries" /></>; }
