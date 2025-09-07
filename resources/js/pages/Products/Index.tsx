import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pen, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Product = {
    id: number;
    product_code: string;
    name: string;
    price: number;
    stock: number;
    can_delete: boolean;
};
type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: {
        current_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        last_page: number;
    };
};

const Index = () => {
    const { products, filters } = usePage().props as unknown as {
        products: Pagination<Product>;
        filters: { search?: string };
    };

    const [search, setSearch] = useState(filters.search || '');

    // Auto search dengan debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Hanya lakukan search jika ada perubahan dari nilai awal
            if (search !== filters.search) {
                router.get(
                    '/products',
                    { search },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 500); // Delay 500ms setelah user berhenti mengetik

        return () => clearTimeout(timeoutId);
    }, [search, filters.search]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/products/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const clearSearch = () => {
        setSearch('');
    };

    // Function to handle pagination with search preservation
    const handlePaginationClick = (url: string | null) => {
        if (!url) return;

        // Parse the URL to get the page parameter
        const urlObj = new URL(url, window.location.origin);
        const page = urlObj.searchParams.get('page');

        // Navigate with both page and search parameters
        router.get(
            '/products',
            {
                page,
                search: search || undefined, // Only include search if it has a value
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar-accent">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Products</h1>
                        <Link
                            href="/products/create"
                            className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                        >
                            + Create Product
                        </Link>
                    </div>

                    {/* Search Input - Auto Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Type to search products..."
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
                                {products.data.length > 0
                                    ? `Found ${products.data.length} product(s) matching "${search}"`
                                    : `No products found matching "${search}"`}
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
                                        Product Code
                                    </th>
                                    <th className="border-b px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Name
                                    </th>
                                    <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Price
                                    </th>
                                    <th className="border-b px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Stock
                                    </th>
                                    <th className="border-b px-6 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {products.data.length > 0 ? (
                                    products.data.map((product, index) => (
                                        <tr
                                            key={product.id}
                                            className="transition-colors duration-200 even:bg-gray-50/40 hover:bg-gray-50/50 dark:even:bg-gray-800/20 dark:hover:bg-gray-800/30"
                                        >
                                            {/* Nomor urut */}
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {index + 1 + ((products.meta?.current_page - 1) * products.meta?.per_page || 0)}
                                            </td>

                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-xs dark:bg-gray-800">
                                                    {product.product_code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                <span className="font-semibold">Rp {Number(product.price).toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                        product.stock > 10
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : product.stock > 0
                                                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
                                                <div className="flex justify-center space-x-2">
                                                    <Link
                                                        href={`/products/${product.id}/edit`}
                                                        className="rounded bg-yellow-500 px-3 py-1 text-xs text-white transition-colors hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                                                        title="Edit Product"
                                                    >
                                                        <Pen className="h-4 w-4" />
                                                    </Link>

                                                    {product.can_delete && (
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="rounded bg-red-500 px-3 py-1 text-xs text-white transition-colors hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                                                            title="Delete Product"
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
                                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                            {search ? `No products found matching "${search}"` : 'No products found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination*/}
                    <div className="mt-6 flex justify-end space-x-1">
                        {products.links.map((link, idx) => (
                            <button
                                key={idx}
                                onClick={() => handlePaginationClick(link.url)}
                                disabled={!link.url}
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
};

export default Index;
