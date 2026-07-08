import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/sign-in");

  // Save user to our database on first visit
  await db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {},
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {clerkUser.firstName} 👋</h1>
      <p className="text-gray-500 mt-1">
        You are logged in as {clerkUser.emailAddresses[0].emailAddress}
      </p>
    </div>
  );
}
