import { FeaturePage } from '@/components/feature-page';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Super Admin" title="Audit Logs" description="Review restricted audit events for administrator actions and sensitive financial operations." /><AdminResourceTable resource="audit-logs" title="Audit Events" /></>; }
