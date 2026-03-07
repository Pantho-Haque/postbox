import { NotificationProvider } from "./notifyContext";
import ClientProviders from "./ClientProviders";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <NotificationProvider>{children}</NotificationProvider>
    </ClientProviders>
  );
}
