// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    ShoppingBag,
    Users,
    Receipt,
    UserCheck,
    BarChart3,
    Settings,
    // Folder,
    // BookOpen,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.url(),
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: '/products',
        icon: ShoppingBag,
        // items: [
        //     { title: 'All Products', href: '#' },
        //     { title: 'Categories', href: '#' },
        //     { title: 'Stock Management', href: '#' },
        // ],
    },
    {
        title: 'Transactions',
        href: '#',
        icon: Receipt,
        // items: [
        //     { title: 'All Transactions', href: '#' },
        //     { title: 'Transaction Items', href: '#' },
        //     { title: 'Payment History', href: '#' },
        // ],
    },
    {
        title: 'Customers',
        href: '#',
        icon: Users,
        // items: [
        //     { title: 'All Customers', href: '#' },
        //     { title: 'Customer Analytics', href: '#' },
        // ],
    },
    {
        title: 'Users',
        href: '#',
        icon: UserCheck,
        // items: [
        //     { title: 'All Users', href: '#' },
        //     { title: 'User Roles', href: '#' },
        // ],
    },
    {
        title: 'Reports',
        href: '#',
        icon: BarChart3,
        // items: [
        //     { title: 'Sales Report', href: '#' },
        //     { title: 'Product Report', href: '#' },
        //     { title: 'Customer Report', href: '#' },
        //     { title: 'Financial Report', href: '#' },
        // ],
    },
];

const settingsNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '#',
        icon: Settings,
        // items: [
        //     { title: 'General Settings', href: '#' },
        //     { title: 'Payment Settings', href: '#' },
        //     { title: 'Tax Settings', href: '#' },
        //     { title: 'Store Settings', href: '#' },
        // ],
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={settingsNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
