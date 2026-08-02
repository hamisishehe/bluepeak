import { FeaturePage } from '@/components/feature-page';
import { AdminStaffForm } from '@/components/admin-staff-form';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Super Admin" title="Administrator Management" description="Create administrators, review admin status, and manage required password change state." actions={['Create Admin', 'Edit Admin', 'Reset Password']} /><AdminStaffForm /><AdminResourceTable resource="administrators" title="Administrators" /></>; }
