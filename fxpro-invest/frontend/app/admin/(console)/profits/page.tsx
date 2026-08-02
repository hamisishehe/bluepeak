import { FeaturePage } from '@/components/feature-page';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Admin" title="Weekly Returns" description="Monitor scheduled return records and processing status for all active investments." /><AdminResourceTable resource="profits" title="Profit Records" /></>; }
