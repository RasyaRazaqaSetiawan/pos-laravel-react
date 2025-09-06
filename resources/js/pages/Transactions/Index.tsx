import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, Eye, Plus, Receipt, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';

type User = {
    id: number;
    name: string;
};

type Customer = {
    id: number;
    full_name: string;
    phone?: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
};

type TransactionItem = {
    id: number;
    product_id: number;
    qty: number;
    price: number;
    subtotal: number;
    product: Product;
};

type Transaction = {
    id: number;
    user_id: number;
    customer_id?: number;
    subtotal: number;
    discount: number;
    total: number;
    created_at: string;
    user: User;
    customer?: Customer;
    items: TransactionItem[];
};

type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

export default function Index() {
    const { transactions, filters } = usePage().props as unknown as {
        transactions: Pagination<Transaction>;
        filters: { search?: string };
    };

    const [search, setSearch] = useState(filters.search || '');

    // Auto search dengan debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    '/transactions',
                    { search },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, filters.search]);

    const clearSearch = () => {
        setSearch('');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return `Rp ${Number(amount).toLocaleString('id-ID')}`;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Transactions', href: '/transactions' }]}>
            <Head title="Transactions" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar-accent">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
                        </div>
                        <Link
                            href="/transactions/create"
                            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            New Transaction
                        </Link>
                    </div>

                    {/* Search Input */}
                    <div className="mb-6">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by transaction ID, customer name..."
                                className="w-full rounded-lg border border-sidebar-border/70 bg-white py-2 pr-10 pl-10 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-80 dark:border-sidebar-border dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                            />
                            {search && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {search && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {transactions.data.length > 0
                                    ? `Found ${transactions.data.length} transaction(s) matching "${search}"`
                                    : `No transactions found matching "${search}"`}
                            </p>
                        )}
                    </div>

                    {/* Table Container */}
                    <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="min-w-full bg-white dark:bg-sidebar-accent">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        ID
                                    </th>
                                    <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Date
                                    </th>
                                    <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Customer
                                    </th>
                                    <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Cashier
                                    </th>
                                    <th className="border-b px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Items
                                    </th>
                                    <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Subtotal
                                    </th>
                                    <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Discount
                                    </th>
                                    <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Total
                                    </th>
                                    <th className="border-b px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {transactions.data.length > 0 ? (
                                    transactions.data.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="transition-colors duration-200 even:bg-gray-50/40 hover:bg-gray-50/50 dark:even:bg-gray-800/20 dark:hover:bg-gray-800/30"
                                        >
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                <span className="rounded bg-blue-100 px-2 py-1 font-mono text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    #{transaction.id.toString().padStart(2, '0')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-xs">{formatDate(transaction.created_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {transaction.customer ? (
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                        <div>
                                                            <div className="font-medium">{transaction.customer.full_name}</div>
                                                            {transaction.customer.phone && (
                                                                <div className="text-xs text-gray-500">{transaction.customer.phone}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic">Walk-in Customer</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                <span className="text-sm">{transaction.user.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                                                <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                    {transaction.items.reduce((sum, item) => sum + item.qty, 0)} items
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                <span className="font-mono">{formatCurrency(transaction.subtotal)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                                                {transaction.discount > 0 ? (
                                                    <span className="font-mono text-red-600 dark:text-red-400">
                                                        -{formatCurrency(transaction.discount)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                <span className="font-mono font-semibold text-green-600 dark:text-green-400">
                                                    {formatCurrency(transaction.total)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                                                <Link
                                                    href={`/transactions/${transaction.id}`}
                                                    className="inline-flex items-center gap-1 rounded bg-blue-500 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                                    title="View Transaction"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Receipt className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                                                <div>{search ? `No transactions found matching "${search}"` : 'No transactions found.'}</div>
                                                {!search && (
                                                    <Link
                                                        href="/transactions/create"
                                                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        Create your first transaction
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-end space-x-1">
                        {transactions.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg border px-3 py-2 text-sm transition-colors duration-200 ${
                                    link.active
                                        ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-600 dark:bg-blue-600'
                                        : 'border-sidebar-border/70 bg-white text-gray-700 hover:bg-gray-50 dark:border-sidebar-border dark:bg-sidebar-accent dark:text-gray-300 dark:hover:bg-gray-800/30'
                                } ${!link.url ? 'cursor-not-allowed opacity-50' : 'hover:shadow-sm'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
