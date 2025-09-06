import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { DollarSign, Package, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type StatCardProps = {
    icon: React.ComponentType<{ size?: number }>;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange';
};

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }: StatCardProps) => {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 transition-shadow hover:shadow-md dark:border-sidebar-border dark:bg-sidebar-accent">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
                    )}
                </div>
                <div className={`rounded-full p-3 ${colorClasses[color]} dark:bg-opacity-20`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

type DashboardProps = {
    todaySales: number;
    todayTransactions: number;
    totalProducts: number;
    totalCustomers: number;
};

export default function Dashboard() {
    const { todaySales, todayTransactions, totalProducts, totalCustomers } =
        usePage().props as unknown as DashboardProps;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <StatCard
                        icon={DollarSign}
                        title="Penjualan Hari Ini"
                        value={formatCurrency(todaySales)}
                        subtitle={`${todayTransactions} transaksi`}
                        color="green"
                    />
                    <StatCard
                        icon={Package}
                        title="Total Produk"
                        value={totalProducts}
                        subtitle="Item tersedia"
                        color="blue"
                    />
                    <StatCard
                        icon={Users}
                        title="Total Pelanggan"
                        value={totalCustomers}
                        subtitle="Pelanggan terdaftar"
                        color="purple"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
