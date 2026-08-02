import { FeaturePage } from '@/components/feature-page';
import { AdminUserForm } from '@/components/admin-user-form';
import { AdminUserActions } from '@/components/admin-user-actions';
import { AdminResourceTable } from '@/components/admin-resource-table';
export default function Page() { return <><FeaturePage eyebrow="Admin" title="Users" description="View investor profiles, balances, status, verification fields, and operational account state." actions={['Create', 'Edit', 'Block', 'Activate', 'Delete']} /><AdminResourceTable resource="users" title="User Records" /><AdminUserForm /><AdminUserActions /></>; }
