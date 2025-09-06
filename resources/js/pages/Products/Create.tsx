import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Archive, DollarSign, Hash, Package } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_code: '',
        name: '',
        price: '',
        stock: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products', {
            onSuccess: () => {
                reset();
            },
        });
    };

    const generateProductCode = () => {
        // Generate random product code with format: PRD-YYYYMMDD-XXX
        const now = new Date();
        const dateStr = now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 999)
            .toString()
            .padStart(3, '0');
        const productCode = `PRD-${dateStr}-${randomNum}`;
        setData('product_code', productCode);
    };

    return (
        <AppLayout
            // breadcrumbs={[
            //     { title: 'Products', href: '/products' },
            //     { title: 'Create Product', href: '/products/create' },
            // ]}
        >
            <Head title="Create Product" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar-accent">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create New Product</h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new product to your inventory</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Product Code */}
                            <div>
                                <label htmlFor="product_code" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Hash className="mr-1 inline h-4 w-4" />
                                    Product Code
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        id="product_code"
                                        type="text"
                                        value={data.product_code}
                                        onChange={(e) => setData('product_code', e.target.value)}
                                        placeholder="e.g., PRD-20241201-001"
                                        className={`flex-1 rounded-lg border bg-white px-3 py-2 font-mono text-sm text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${
                                            errors.product_code
                                                ? 'border-red-500 dark:border-red-400'
                                                : 'border-sidebar-border/70 dark:border-sidebar-border'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={generateProductCode}
                                        className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                                        title="Generate Code"
                                    >
                                        Generate
                                    </button>
                                </div>
                                {errors.product_code && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.product_code}</p>}
                            </div>

                            {/* Product Name */}
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Package className="mr-1 inline h-4 w-4" />
                                    Product Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter product name"
                                    className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${
                                        errors.name ? 'border-red-500 dark:border-red-400' : 'border-sidebar-border/70 dark:border-sidebar-border'
                                    }`}
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>}
                            </div>

                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <DollarSign className="mr-1 inline h-4 w-4" />
                                    Price (IDR)
                                </label>
                                <div className="relative">
                                    <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500 dark:text-gray-400">Rp</span>
                                    <input
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className={`w-full rounded-lg border bg-white py-2 pr-3 pl-10 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${
                                            errors.price
                                                ? 'border-red-500 dark:border-red-400'
                                                : 'border-sidebar-border/70 dark:border-sidebar-border'
                                        }`}
                                        required
                                    />
                                </div>
                                {errors.price && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.price}</p>}
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Archive className="mr-1 inline h-4 w-4" />
                                    Initial Stock
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    placeholder="0"
                                    min="0"
                                    className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${
                                        errors.stock ? 'border-red-500 dark:border-red-400' : 'border-sidebar-border/70 dark:border-sidebar-border'
                                    }`}
                                    required
                                />
                                {errors.stock && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Preview Card */}
                        {(data.name || data.price || data.stock) && (
                            <div className="mt-8 rounded-lg border border-sidebar-border/70 bg-gray-50 p-4 dark:border-sidebar-border dark:bg-gray-800/50">
                                <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Preview:</h3>
                                <div className="rounded-lg border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar-accent">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {data.product_code && (
                                                <span className="mb-2 inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                    {data.product_code}
                                                </span>
                                            )}
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{data.name || 'Product Name'}</h4>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                Rp {data.price ? Number(data.price).toLocaleString() : '0'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                    Number(data.stock) > 10
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : Number(data.stock) > 0
                                                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                Stock: {data.stock || '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-3 border-t border-sidebar-border/70 pt-6 dark:border-sidebar-border">
                            <Link
                                href="/products"
                                className="rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-sidebar-border dark:bg-sidebar-accent dark:text-gray-300 dark:hover:bg-gray-800/50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
                            >
                                {processing ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
