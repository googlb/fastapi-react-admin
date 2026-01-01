import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router/router';
import { HeroUIProvider } from '@heroui/react';

function App() {
  return (
    <HeroUIProvider>
      <RouterProvider router={router} />
    </HeroUIProvider>
  );
}

export default App;
