import { FeaturePage } from '@/components/feature-page';
import { AdminActionPanel } from '@/components/admin-action-panel';
import { AdminDepositForm } from '@/components/admin-deposit-form';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Admin" title="Deposit Review" description="Approve or reject pending deposits, validate proof, and create investments through the controlled approval workflow." actions={['Add Deposit', 'Approve', 'Reject']} /><AdminResourceTable resource="deposits" title="Deposit Queue" /><AdminDepositForm /><AdminActionPanel resource="deposits" /></>; }
