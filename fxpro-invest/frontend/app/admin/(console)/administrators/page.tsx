import { FeaturePage } from '@/components/feature-page';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Super Admin" title="Administrator Management" description="Create administrators, review admin status, and manage required password change state." actions={['Invite Admin']} /><AdminResourceTable resource="administrators" title="Administrators" /></>; }
