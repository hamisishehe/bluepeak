import { FeaturePage } from '@/components/feature-page';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Admin" title="Investments" description="Review all investments, pause or resume active records, and require reasons for sensitive status changes." actions={['Pause', 'Resume']} /><AdminResourceTable resource="investments" title="Investment Records" /></>; }
