import { Outlet } from '@tanstack/react-router';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar isBordered>
                <NavbarBrand>
                    <p className="font-bold text-inherit">FastAPI Admin</p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Dashboard
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link href="#" aria-current="page">
                            Users
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button as={Link} color="primary" href="#" variant="flat">
                            Logout
                        </Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                <Outlet />
            </main>
        </div>
    );
};
