import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OJTProvider } from './context/OJTContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <OJTProvider>
        <RouterProvider router={router} />
        <Toaster />
      </OJTProvider>
    </AuthProvider>
  );
}
