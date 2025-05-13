import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    return redirect("/login");
  }

  if (session.user.role !== "admin") {
    return redirect(`/userdash/${session.user.id}`);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}