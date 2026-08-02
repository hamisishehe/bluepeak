import { FeaturePage } from '@/components/feature-page';
import { WithdrawalForm } from '@/components/workflow-form';
import { UserResourceTable } from '@/components/user-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Investor" title="Withdrawals" description="Request withdrawals to verified wallet addresses and follow pending, processing, paid, or rejected statuses." actions={['Request Withdrawal']} /><WithdrawalForm /><UserResourceTable resource="withdrawals" title="Withdrawal History" /></>; }
