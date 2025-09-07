import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Edit,
    Package,
    Phone,
    // FileText,
    Tag,
    User,
} from 'lucide-react';

type Customer = {
    id: number;
    name?: string;
    full_name?: string;
    phone?: string;
    email?: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    sku?: string;
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
    customer_id: number | null;
    subtotal: number;
    discount: number;
    total: number;
    created_at: string;
    updated_at: string;
    customer: Customer | null;
    items: TransactionItem[];
};

export default function Show() {
    const { transaction } = usePage().props as unknown as {
        transaction: Transaction;
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return `Rp ${Number(amount).toLocaleString('id-ID')}`;
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-Id', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get customer name
    const getCustomerName = (customer: Customer | null) => {
        if (!customer) return 'Walk-in Customer';
        return customer.full_name || customer.name || 'Unknown Customer';
    };

    // Calculate total items
    const totalItems = transaction.items.reduce((sum, item) => sum + item.qty, 0);

    return (
        <AppLayout>
            <Head title={`Transaction #${transaction.id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar-accent">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transaction #{transaction.id.toString().padStart(2, '0')}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Created: {formatDate(transaction.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/transactions/${transaction.id}/edit`}
                                className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-yellow-600"
                            >
                                <Edit className="h-4 w-4" />
                                Edit
                            </Link>
                            <Link
                                href="/transactions"
                                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to List
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column - Transaction Details */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Customer Information */}
                            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800/30">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <User className="h-5 w-5" />
                                    Customer Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{getCustomerName(transaction.customer)}</p>
                                        </div>
                                    </div>
                                    {transaction.customer?.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.customer.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                                            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Date</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(transaction.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Items */}
                            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800/30">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <Package className="h-5 w-5" />
                                    Items Purchased ({transaction.items.length} items, {totalItems} pieces)
                                </h3>

                                <div className="space-y-4">
                                    {transaction.items.map((item, index) => (
                                        <div key={item.id} className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-700">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-2 flex items-center gap-3">
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                            {index + 1}
                                                        </span>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{item.product.name}</h4>
                                                            {item.product.sku && <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="ml-11 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                                                        <div>
                                                            <p className="text-gray-500 dark:text-gray-400">Unit Price</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                {formatCurrency(item.price)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 dark:text-gray-400">Quantity</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{item.qty} pcs</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 dark:text-gray-400">Stock Available</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{item.product.stock} pcs</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                                                            <p className="font-bold text-green-600 dark:text-green-400">
                                                                {formatCurrency(item.subtotal)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Payment Summary */}
                        <div className="sticky top-4 h-fit">
                            {/* Transaction Summary */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-800/30">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <DollarSign className="h-5 w-5" />
                                    Payment Summary
                                </h3>

                                <div className="space-y-4">
                                    <div className="rounded-lg bg-white p-4 dark:bg-gray-700">
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems} pcs</span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                                <span className="font-mono font-medium text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(transaction.subtotal)}
                                                </span>
                                            </div>

                                            {transaction.discount > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <Tag className="h-4 w-4" />
                                                        Discount:
                                                    </span>
                                                    <span className="font-mono font-medium text-red-600 dark:text-red-400">
                                                        -{formatCurrency(transaction.discount)}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="border-t border-gray-200 pt-3 dark:border-gray-600">
                                                <div className="flex justify-between text-lg">
                                                    <span className="font-semibold text-gray-900 dark:text-gray-100">Total Payment:</span>
                                                    <span className="font-mono font-bold text-green-600 dark:text-green-400">
                                                        {formatCurrency(transaction.total)}
                                                    </span>
                                                </div>
                                            </div>

                                            {transaction.discount > 0 && (
                                                <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                                                            Discount Applied: {((transaction.discount / transaction.subtotal) * 100).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                                        You saved {formatCurrency(transaction.discount)}!
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons
                            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800/30">
                                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    <FileText className="h-5 w-5" />
                                    Actions
                                </h3>

                                <div className="space-y-3">
                                    <button
                                        onClick={handlePrint}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-white transition-colors duration-200 hover:bg-blue-600"
                                    >
                                        <Printer className="h-4 w-4" />
                                        Print Receipt
                                    </button>

                                    <Link
                                        href={`/transactions/${transaction.id}/edit`}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-3 text-white transition-colors duration-200 hover:bg-yellow-600"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit Transaction
                                    </Link>

                                    <Link
                                        href="/transactions/create"
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-green-600"
                                    >
                                        <Receipt className="h-4 w-4" />
                                        New Transaction
                                    </Link>

                                    <Link
                                        href="/transactions"
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-600"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to List
                                    </Link>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }

                    .print-area, .print-area * {
                        visibility: visible;
                    }

                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }

                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
        </AppLayout>
    );
}
