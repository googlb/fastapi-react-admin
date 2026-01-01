import { Button, Card, CardBody, CardHeader, Divider, Link } from "@heroui/react";
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 py-8 md:py-10 bg-background text-foreground">
      <Card className="w-[350px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md">HeroUI + Vite + Tailwind 4</p>
            <p className="text-small text-default-500">FastAPI React Admin</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col gap-4 items-center">
            <Button color="primary" onPress={() => setCount((count) => count + 1)}>
              Count is {count}
            </Button>
            <p className="text-sm text-default-500">
              Edit <code>src/App.tsx</code> to test HMR
            </p>
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-4">
        <Link href="https://vite.dev" isExternal showAnchorIcon>
          Vite Docs
        </Link>
        <Link href="https://www.heroui.com" isExternal showAnchorIcon>
          HeroUI Docs
        </Link>
      </div>
    </div>
  );
}

export default App;
