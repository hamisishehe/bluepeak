import { FeaturePage } from '@/components/feature-page';
import { WalletForm } from '@/components/workflow-form';
import { UserResourceTable } from '@/components/user-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Investor" title="Wallet Addresses" description="Manage BEP20 and TRC20 payout addresses with clear active address records." actions={['Add Wallet']} /><WalletForm /><UserResourceTable resource="wallet-addresses" title="Saved Wallets" /></>; }
