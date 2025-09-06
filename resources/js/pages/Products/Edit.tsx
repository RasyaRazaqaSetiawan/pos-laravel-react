import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Archive, DollarSign, Hash, Package, Save } from 'lucide-react';

type Product = {
    id: number;
    product_code: string;
    name: string;
    price: number;
    stock: number;
};

export default function Edit() {
    const { product } = usePage().props as unknown as { product: Product };

    const { data, setData, put, processing, errors, reset, isDirty } = useForm({
        product_code: product.product_code || '',
        name: product.name || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/products/${product.id}`);
    };

    const handleReset = () => {
        reset();
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

    // Check if current data is different from original
    const hasChanges = isDirty;

    return (
        <AppLayout
        // breadcrumbs={[
        //     { title: 'Products', href: '/products' },
        //     { title: 'Edit Product', href: `/products/${product.id}/edit` },
        // ]}
        >
            <Head title={`Edit ${product.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar-accent">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Product</h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Update product information for <span className="font-medium">{product.name}</span>
                                </p>
                            </div>
                        </div>
                        {hasChanges && (
                            <div className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                                Unsaved changes
                            </div>
                        )}
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
                                        title="Generate New Code"
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
                                    Stock Quantity
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

                        {/* Comparison Section */}
                        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Original Data */}
                            <div className="rounded-lg border border-sidebar-border/70 bg-gray-50 p-4 dark:border-sidebar-border dark:bg-gray-800/50">
                                <h3 className="mb-3 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Archive className="mr-1 h-4 w-4" />
                                    Original Data:
                                </h3>
                                <div className="rounded-lg border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar-accent">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Code:</span>
                                            <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-gray-800">
                                                {product.product_code}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Price:</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                Rp {Number(product.price).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Stock:</span>
                                            <span
                                                className={`rounded-full px-2 py-1 text-sm ${
                                                    product.stock > 10
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : product.stock > 0
                                                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}
                                            >
                                                {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Updated Preview */}
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                <h3 className="mb-3 flex items-center text-sm font-medium text-blue-700 dark:text-blue-300">
                                    <Save className="mr-1 h-4 w-4" />
                                    Updated Preview:
                                </h3>
                                <div className="rounded-lg border border-sidebar-border/70 bg-white p-4 dark:border-sidebar-border dark:bg-sidebar-accent">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Code:</span>
                                            <span
                                                className={`rounded px-2 py-1 font-mono text-sm ${
                                                    data.product_code !== product.product_code
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                }`}
                                            >
                                                {data.product_code || 'Not set'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                                            <span
                                                className={`text-sm font-medium ${
                                                    data.name !== product.name
                                                        ? 'text-yellow-800 dark:text-yellow-400'
                                                        : 'text-gray-900 dark:text-gray-100'
                                                }`}
                                            >
                                                {data.name || 'Not set'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Price:</span>
                                            <span
                                                className={`text-sm font-semibold ${
                                                    data.price !== product.price.toString()
                                                        ? 'text-yellow-800 dark:text-yellow-400'
                                                        : 'text-gray-900 dark:text-gray-100'
                                                }`}
                                            >
                                                Rp {data.price ? Number(data.price).toLocaleString() : '0'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Stock:</span>
                                            <span
                                                className={`rounded-full px-2 py-1 text-sm ${
                                                    Number(data.stock) > 10
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : Number(data.stock) > 0
                                                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                } ${data.stock !== product.stock.toString() ? 'ring-2 ring-yellow-300 dark:ring-yellow-600' : ''}`}
                                            >
                                                {data.stock || '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-3 border-t border-sidebar-border/70 pt-6 dark:border-sidebar-border">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={!hasChanges}
                                className="rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sidebar-border dark:bg-sidebar-accent dark:text-gray-300 dark:hover:bg-gray-800/50"
                            >
                                Reset
                            </button>
                            <Link
                                href="/products"
                                className="rounded-lg border border-sidebar-border/70 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-sidebar-border dark:bg-sidebar-accent dark:text-gray-300 dark:hover:bg-gray-800/50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || !hasChanges}
                                className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                <Save className="h-4 w-4" />
                                <span>{processing ? 'Updating...' : 'Update Product'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
