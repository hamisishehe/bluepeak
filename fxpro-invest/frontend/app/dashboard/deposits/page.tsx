import { FeaturePage } from '@/components/feature-page';
import { DepositForm } from '@/components/workflow-form';
import { UserResourceTable } from '@/components/user-resource-table';
import { DepositAddresses } from '@/components/deposit-addresses';
export default function Page() { return <><FeaturePage eyebrow="Investor" title="Deposits" description="Send USDT to the correct network address, then submit your transaction reference for administrator review." actions={['New Deposit']} /><DepositAddresses /><DepositForm /><UserResourceTable resource="deposits" title="Deposit History" /></>; }
