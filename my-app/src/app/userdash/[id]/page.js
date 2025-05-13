import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function UserDashboardPage(props) {
  const { id } = await props.params;
  const session = await auth();

  if (!session?.user) {
    return redirect('/login');
  }
  if (session.user.role === 'admin') {
    return redirect('/admindash');
  }
  if (session.user.id !== id) {
    return redirect(`/userdash/${session.user.id}`);
  }

  return redirect(`/userdash/${id}/overview`);
}