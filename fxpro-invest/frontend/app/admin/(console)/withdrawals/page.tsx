import { FeaturePage } from '@/components/feature-page';
import { AdminActionPanel } from '@/components/admin-action-panel';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Admin" title="Withdrawals" description="Approve, process, reject, or mark withdrawals as paid while reserved balances stay reconciled." actions={['Approve', 'Process', 'Mark Paid']} /><AdminResourceTable resource="withdrawals" title="Withdrawal Queue" /><AdminActionPanel resource="withdrawals" /></>; }
