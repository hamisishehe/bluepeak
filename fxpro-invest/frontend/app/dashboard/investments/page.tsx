import { FeaturePage } from '@/components/feature-page';
import { UserResourceTable } from '@/components/user-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Investor" title="Investments" description="Investments are created automatically after an administrator approves your deposit. Submit a deposit first, then check this page after approval." actions={['View Details']} /><UserResourceTable resource="investments" title="Investment Records" /></>; }
