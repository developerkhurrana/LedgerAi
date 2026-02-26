import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ChatExpert } from '@/components/chat/ChatExpert';

export default async function ChatPage() {
  const session = await getServerSession();
  if (!session?.user) redirect('/login');

  return <ChatExpert />;
}
