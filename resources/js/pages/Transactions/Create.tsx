import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Minus, Package, Plus, Receipt, Search, ShoppingCart, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

type Customer = {
    id: number;
    name?: string;
    full_name?: string; // Tambahkan field ini
    phone?: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
};

type TransactionItem = {
    product_id: number;
    qty: number;
    price: number;
    subtotal: number;
    product: Product;
};

export default function Create() {
    const { customers, products } = usePage().props as unknown as {
        customers: Customer[];
        products: Product[];
    };

    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
    const [items, setItems] = useState<TransactionItem[]>([]);
    const [productSearch, setProductSearch] = useState('');
    // Perbaikan: Inisialisasi dengan string kosong, bukan undefined
    const [customerSearch, setCustomerSearch] = useState('');
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Utility function untuk mendapatkan nama customer
    const getCustomerName = (customer: Customer) => {
        return customer.full_name || customer.name || '';
    };

    // Filter products based on search
    const filteredProducts =
        products?.filter(
            (p) =>
                (p?.name ?? '').toLowerCase().includes(productSearch.toLowerCase()) &&
                (p?.stock ?? 0) > 0 &&
                !items.some((i) => i.product_id === p?.id),
        ) ?? [];

    // Filter customers based on search - Perbaikan disini
    const filteredCustomers =
        customers?.filter((c) => {
            const name = getCustomerName(c).toLowerCase();
            const phone = (c?.phone ?? '').toLowerCase();
            const search = (customerSearch ?? '').toLowerCase();
            return name.includes(search) || phone.includes(search);
        }) ?? [];

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    // Calculate discount (same logic as controller)
    const discount = subtotal > 1000000 ? subtotal * 0.15 : subtotal > 500000 ? subtotal * 0.1 : 0;

    const total = subtotal - discount;

    // Add product to transaction
    const addProduct = (product: Product) => {
        const newItem: TransactionItem = {
            product_id: product.id,
            qty: 1,
            price: product.price,
            subtotal: product.price,
            product: product,
        };

        setItems([...items, newItem]);
        setProductSearch('');
        setShowProductDropdown(false);
    };

    // Update item quantity
    const updateQuantity = (productId: number, newQty: number) => {
        if (newQty <= 0) {
            removeItem(productId);
            return;
        }

        setItems(
            items.map((item) => {
                if (item.product_id === productId) {
                    const maxQty = item.product.stock;
                    const qty = Math.min(newQty, maxQty);
                    return {
                        ...item,
                        qty,
                        subtotal: item.price * qty,
                    };
                }
                return item;
            }),
        );
    };

    // Remove item from transaction
    const removeItem = (productId: number) => {
        setItems(items.filter((item) => item.product_id !== productId));
    };

    // Select customer - Perbaikan disini
    const selectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer.id);
        setCustomerSearch(getCustomerName(customer)); // Gunakan utility function
        setShowCustomerDropdown(false);
    };

    // Clear customer selection
    const clearCustomer = () => {
        setSelectedCustomer(null);
        setCustomerSearch(''); // Pastikan selalu string kosong, bukan undefined
    };

    // Submit transaction
    const submitTransaction = () => {
        if (items.length === 0) {
            alert('Please add at least one item to the transaction.');
            return;
        }

        setProcessing(true);

        const data = {
            customer_id: selectedCustomer,
            items: items.map((item) => ({
                product_id: item.product_id,
                qty: item.qty,
            })),
        };

        router.post('/transactions', data, {
            onFinish: () => setProcessing(false),
            onError: (errors) => {
                console.error('Transaction errors:', errors);
                setProcessing(false);
            },
        });
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return `Rp ${Number(amount).toLocaleString('id-ID')}`;
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowProductDropdown(false);
            setShowCustomerDropdown(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <AppLayout>
            <Head title="Create Transaction" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar-accent">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Transaction</h1>
                        </div>
                        <Link
                            href="/transactions"
                            className="flex items-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Transactions
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column - Customer & Product Selection */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Customer Selection */}
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
                                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <User className="h-5 w-5" />
                                    Customer
                                </h3>
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={customerSearch} // Sudah dipastikan selalu string
                                            onChange={(e) => {
                                                const value = e.target.value || ''; // Pastikan tidak undefined
                                                setCustomerSearch(value);
                                                setShowCustomerDropdown(true);
                                                if (!value) setSelectedCustomer(null);
                                            }}
                                            onFocus={() => setShowCustomerDropdown(true)}
                                            placeholder="Search customer or leave empty for walk-in..."
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-white py-2 pr-10 pl-10 text-gray-900 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-sidebar-border dark:bg-gray-700 dark:text-gray-100"
                                        />
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                        {selectedCustomer && (
                                            <button
                                                onClick={clearCustomer}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {showCustomerDropdown && filteredCustomers && filteredCustomers.length > 0 && (
                                        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-sidebar-border/70 bg-white shadow-lg dark:border-sidebar-border dark:bg-gray-700">
                                            {filteredCustomers.slice(0, 10).map((customer) => (
                                                <button
                                                    key={customer.id}
                                                    onClick={() => selectCustomer(customer)}
                                                    className="w-full px-4 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">{getCustomerName(customer)}</div>
                                                    {customer.phone && <div className="text-sm text-gray-500">{customer.phone}</div>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Selection */}
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
                                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <Package className="h-5 w-5" />
                                    Add Products
                                </h3>
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={productSearch}
                                            onChange={(e) => {
                                                setProductSearch(e.target.value);
                                                setShowProductDropdown(true);
                                            }}
                                            onFocus={() => setShowProductDropdown(true)}
                                            placeholder="Search products to add..."
                                            className="w-full rounded-lg border border-sidebar-border/70 bg-white py-2 pl-10 text-gray-900 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-sidebar-border dark:bg-gray-700 dark:text-gray-100"
                                        />
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    </div>

                                    {showProductDropdown && filteredProducts.length > 0 && (
                                        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-sidebar-border/70 bg-white shadow-lg dark:border-sidebar-border dark:bg-gray-700">
                                            {filteredProducts.slice(0, 10).map((product) => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => addProduct(product)}
                                                    className="w-full px-4 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                                                            <div className="text-sm text-gray-500">Stock: {product.stock}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold text-green-600 dark:text-green-400">
                                                                {formatCurrency(product.price)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Selected Items */}
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
                                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <ShoppingCart className="h-5 w-5" />
                                    Selected Items ({items.length})
                                </h3>

                                {items.length === 0 ? (
                                    <div className="py-8 text-center text-gray-500">
                                        <Package className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                                        <p>No items selected. Search and add products above.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {items.map((item) => (
                                            <div
                                                key={item.product_id}
                                                className="flex items-center justify-between rounded-lg bg-white p-4 dark:bg-gray-700"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.product.name}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {formatCurrency(item.price)} each • Stock: {item.product.stock}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.product_id, item.qty - 1)}
                                                            className="rounded bg-gray-200 p-1 transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={item.product.stock}
                                                            value={item.qty}
                                                            onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                                                            className="w-16 rounded border border-gray-300 bg-white py-1 text-center text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&[type=number]]:[-moz-appearance:textfield]"
                                                        />
                                                        <button
                                                            onClick={() => updateQuantity(item.product_id, item.qty + 1)}
                                                            disabled={item.qty >= item.product.stock}
                                                            className="rounded bg-gray-200 p-1 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <div className="min-w-[100px] text-right">
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {formatCurrency(item.subtotal)}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.product_id)}
                                                        className="p-1 text-red-500 transition-colors hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Transaction Summary */}
                        <div className="sticky top-4 h-fit rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Transaction Summary</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Items:</span>
                                    <span className="font-medium">{items.reduce((sum, item) => sum + item.qty, 0)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span className="font-mono">{formatCurrency(subtotal)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Discount ({subtotal > 1000000 ? '15%' : '10%'}):</span>
                                        <span className="font-mono text-red-600 dark:text-red-400">-{formatCurrency(discount)}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-3 dark:border-gray-600">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span className="text-gray-900 dark:text-gray-100">Total:</span>
                                        <span className="font-mono text-green-600 dark:text-green-400">{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={submitTransaction}
                                    disabled={processing || items.length === 0}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Receipt className="h-4 w-4" />
                                            Create Transaction
                                        </>
                                    )}
                                </button>

                                <Link
                                    href="/transactions"
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-600"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
