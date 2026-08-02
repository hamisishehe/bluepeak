import { FeaturePage } from '@/components/feature-page';
import { UserResourceTable } from '@/components/user-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Investor" title="Weekly Returns" description="Track scheduled, credited, failed, and reversed weekly return records for each investment." /><UserResourceTable resource="profits" title="Weekly Return Records" /></>; }
