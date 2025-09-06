import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pen, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Customer = {
    id: number;
    full_name: string;
    phone: string;
    email: string;
    can_delete: boolean; // Add this property
};

type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    per_page: number;
};

export default function Index() {
    const { customers, filters } = usePage().props as unknown as {
        customers: Pagination<Customer>;
        filters: { search?: string };
    };

    const [search, setSearch] = useState(filters.search || '');

    // Auto search dengan debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    '/customers',
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

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            router.delete(`/customers/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const clearSearch = () => {
        setSearch('');
    };

    // Fungsi untuk menghitung nomor urut berdasarkan pagination
    const getRowNumber = (index: number) => {
        const currentPage = customers.current_page || 1;
        const perPage = customers.per_page || 10;
        return (currentPage - 1) * perPage + index + 1;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Customers', href: '/customers' }]}>
            <Head title="Customers" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar-accent">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
                        <Link
                            href="/customers/create"
                            className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                        >
                            + Create Customer
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
                                placeholder="Type to search customers..."
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
                                {customers.data.length > 0
                                    ? `Found ${customers.data.length} customer(s) matching "${search}"`
                                    : `No customers found matching "${search}"`}
                            </p>
                        )}
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="min-w-full bg-white dark:bg-sidebar-accent">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        No
                                    </th>
                                    <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Full Name
                                    </th>
                                    <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Phone
                                    </th>
                                    <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Email
                                    </th>
                                    <th className="border-b px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {customers.data.length > 0 ? (
                                    customers.data.map((c, index) => (
                                        <tr
                                            key={c.id}
                                            className="transition-colors duration-200 even:bg-gray-50/40 hover:bg-gray-50/50 dark:even:bg-gray-800/20 dark:hover:bg-gray-800/30"
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{getRowNumber(index)}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{c.full_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{c.phone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{c.email}</td>
                                            <td className="px-6 py-4 text-center text-sm">
                                                <div className="flex justify-center space-x-2">
                                                    <Link
                                                        href={`/customers/${c.id}/edit`}
                                                        className="rounded bg-yellow-500 px-3 py-1 text-xs text-white transition-colors hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                                                        title="Edit Customer"
                                                    >
                                                        <Pen className="h-4 w-4" />
                                                    </Link>

                                                    {/* Only show delete button if customer can be deleted */}
                                                    {c.can_delete && (
                                                        <button
                                                            onClick={() => handleDelete(c.id)}
                                                            className="rounded bg-red-500 px-3 py-1 text-xs text-white transition-colors hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                                                            title="Delete Customer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                            {search ? `No customers found matching "${search}"` : 'No customers found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-end space-x-1">
                        {customers.links.map((link, idx) => (
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
