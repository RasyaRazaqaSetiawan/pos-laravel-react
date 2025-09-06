import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Calculator, CreditCard, Minus, Plus, Receipt, Search, ShoppingCart, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Types
type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
};

type Customer = {
    id: number;
    full_name: string;
    phone?: string;
};

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    maxStock: number;
};

const Index = () => {
    const { customers, products } = usePage().props as unknown as {
        customers: Customer[];
        products: Product[];
    };

    // State management
    const [searchProduct, setSearchProduct] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>({
        id: 0,
        full_name: 'Please select customer',
    });
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [processing, setProcessing] = useState(false);

    // Filter products based on search and stock availability
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchProduct.toLowerCase()) &&
            product.stock > 0 &&
            !cart.some((cartItem) => cartItem.id === product.id),
    );

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

    // Calculate discount based on the same logic as TransactionController
    const autoDiscount = subtotal > 1000000 ? subtotal * 0.15 : subtotal > 500000 ? subtotal * 0.1 : 0;
    const manualDiscountAmount = (subtotal * discount) / 100;
    const totalDiscountAmount = Math.max(autoDiscount, manualDiscountAmount);

    const total = subtotal - totalDiscountAmount;
    const change = paymentAmount - total;

    // FIXED: Improved currency formatting function
    const formatCurrency = (amount: number) => {
        // Ensure amount is a valid number and handle edge cases
        const validAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : Number(amount);

        // Format with proper Indonesian locale
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(validAmount);
    };

    // Cart functions
    const addToCart = (product: Product) => {
        const newCartItem: CartItem = {
            id: product.id,
            name: product.name,
            price: Number(product.price), // FIXED: Ensure price is a number
            quantity: 1,
            subtotal: Number(product.price), // FIXED: Ensure subtotal is properly calculated as number
            maxStock: product.stock,
        };

        setCart((prevCart) => [...prevCart, newCartItem]);
        setSearchProduct('');
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.min(quantity, item.maxStock);
                    const newSubtotal = Number(newQuantity * item.price); // FIXED: Ensure proper number calculation
                    return {
                        ...item,
                        quantity: newQuantity,
                        subtotal: newSubtotal,
                    };
                }
                return item;
            }),
        );
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        setDiscount(0);
        setPaymentAmount(0);
    };

    // Process transaction
    const processTransaction = () => {
        if (cart.length === 0) {
            alert('Please add at least one item to the cart.');
            return;
        }

        if (selectedCustomer.id === 0) {
            alert('Please select a customer before completing the transaction.');
            return;
        }

        if (paymentAmount < total) {
            alert('Payment amount is insufficient.');
            return;
        }

        setProcessing(true);

        const transactionData = {
            customer_id: selectedCustomer.id, // selalu ada ID valid
            items: cart.map((item) => ({
                product_id: item.id,
                qty: item.quantity,
            })),
        };

        router.post('/transactions', transactionData, {
            onSuccess: () => {
                alert('Transaction completed successfully!');
                clearCart();
                setSelectedCustomer({ id: 0, full_name: 'Please select customer' }); // reset lagi
                setShowPaymentModal(false);
            },
            onError: (errors) => {
                console.error('Transaction errors:', errors);
                alert('Transaction failed. Please try again.');
            },
            onFinish: () => setProcessing(false),
        });
    };

    // Auto-focus payment amount when modal opens
    useEffect(() => {
        if (showPaymentModal) {
            setPaymentAmount(total);
        }
    }, [showPaymentModal, total]);

    // Get discount display text
    const getDiscountText = () => {
        if (autoDiscount > 0) {
            const percentage = subtotal > 1000000 ? 15 : 10;
            return `Auto Discount (${percentage}%)`;
        }
        return `Manual Discount (${discount}%)`;
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'POS', href: '/pos' }]}>
            <Head title="Point of Sale" />

            <div className="flex h-[calc(100vh-120px)] gap-4 p-4">
                {/* Left Panel - Products */}
                <div className="flex-1 rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-sidebar-accent">
                    {/* Search Header */}
                    <div className="border-b border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products by name..."
                                    value={searchProduct}
                                    onChange={(e) => setSearchProduct(e.target.value)}
                                    className="w-full rounded-lg border border-sidebar-border/70 bg-white py-3 pr-4 pl-10 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-sidebar-border dark:bg-gray-700 dark:text-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="h-[calc(100%-100px)] overflow-y-auto p-6">
                        {filteredProducts.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                <div className="text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                        <Search className="h-8 w-8" />
                                    </div>
                                    <p className="mb-2 text-lg">{searchProduct ? 'No products found' : 'Start typing to search products'}</p>
                                    <p className="text-sm">
                                        {searchProduct ? 'Try a different search term' : 'Search by product name to add items to cart'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => addToCart(product)}
                                        className="cursor-pointer rounded-lg border border-transparent bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-gray-100 hover:shadow-md dark:bg-gray-800/50 dark:hover:border-blue-800 dark:hover:bg-gray-800"
                                    >
                                        <div className="mb-3 flex aspect-square items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                                                <span className="text-lg font-bold text-white">{product.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</h3>
                                        <div className="mb-1 text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(product.price)}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Stock: {product.stock}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Cart */}
                <div className="flex w-96 flex-col rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-sidebar-accent">
                    {/* Customer Selection */}
                    <div className="border-b border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <button
                            onClick={() => setShowCustomerModal(true)}
                            className="flex w-full items-center gap-2 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                        >
                            <User className="h-4 w-4" />
                            <div className="flex-1 text-left">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{selectedCustomer.full_name}</div>
                                {selectedCustomer.phone && <div className="text-xs text-gray-500 dark:text-gray-400">{selectedCustomer.phone}</div>}
                            </div>
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {cart.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                <ShoppingCart className="mb-2 h-12 w-12" />
                                <p>Cart is empty</p>
                                <p className="text-sm">Search and add products</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div key={item.id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                                        <div className="mb-2 flex items-start justify-between">
                                            <h4 className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</h4>
                                            <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:text-red-700">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.maxStock}
                                                    className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(item.price)} each</div>
                                                <div className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(item.subtotal)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Summary */}
                    {cart.length > 0 && (
                        <div className="border-t border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            {/* Manual Discount Input - only show if no auto discount */}
                            {autoDiscount === 0 && (
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Manual Discount (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-sidebar-border dark:bg-gray-700 dark:text-gray-100"
                                    />
                                </div>
                            )}

                            {/* Totals */}
                            <div className="mb-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                                </div>
                                {totalDiscountAmount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">{getDiscountText()}:</span>
                                        <span className="font-medium text-red-600 dark:text-red-400">-{formatCurrency(totalDiscountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-green-600 dark:text-green-400">{formatCurrency(total)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600"
                                >
                                    <CreditCard className="h-4 w-4" />
                                    Process Payment
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Customer Selection Modal */}
            {showCustomerModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="max-h-96 w-96 overflow-hidden rounded-lg bg-white dark:bg-sidebar-accent">
                        <div className="flex items-center justify-between border-b border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="text-lg font-bold">Select Customer</h3>
                            <button onClick={() => setShowCustomerModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-4">
                            <div className="space-y-2">
                                {customers.map((customer) => (
                                    <button
                                        key={customer.id}
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setShowCustomerModal(false);
                                        }}
                                        className={`w-full rounded-lg p-3 text-left transition-colors ${
                                            selectedCustomer.id === customer.id
                                                ? 'border border-blue-300 bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30'
                                                : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <div className="font-medium">{customer.full_name}</div>
                                        {customer.phone && <div className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-96 rounded-lg bg-white dark:bg-sidebar-accent">
                        <div className="flex items-center justify-between border-b border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="flex items-center gap-2 text-lg font-bold">
                                <Calculator className="h-5 w-5" />
                                Payment
                            </h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Amount</div>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(total)}</div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Amount</label>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                        className="w-full rounded-lg border border-sidebar-border/70 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-sidebar-border dark:bg-gray-700 dark:text-gray-100"
                                        autoFocus
                                    />
                                </div>

                                {change >= 0 && (
                                    <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
                                        <div className="text-sm text-green-600 dark:text-green-400">Change</div>
                                        <div className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(change)}</div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPaymentAmount(total)}
                                        className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Exact
                                    </button>
                                    <button
                                        onClick={() => setPaymentAmount(Math.ceil(total / 1000) * 1000)}
                                        className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    >
                                        Round Up
                                    </button>
                                </div>

                                <button
                                    disabled={paymentAmount < total || processing}
                                    onClick={processTransaction}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Receipt className="h-4 w-4" />
                                            Complete Transaction
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default Index;
