import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';

type Customer = {
    id: number;
    full_name: string;
    phone: string;
    email: string;
};

export default function Edit() {
    const { customer } = usePage().props as unknown as {
        customer: Customer;
    };

    const { data, setData, put, processing, errors } = useForm({
        full_name: customer.full_name,
        phone: customer.phone,
        email: customer.email,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/customers/${customer.id}`);
    };

    return (
        <AppLayout
        // breadcrumbs={[
        //     { title: 'Customers', href: '/customers' },
        //     { title: 'Edit', href: `/customers/${customer.id}/edit` }
        // ]}
        >
            <Head title={`Edit Customer - ${customer.full_name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar-accent">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Customer</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ID: #{customer.id}</p>
                        </div>
                        {/* <Link
                            href="/customers"
                            className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to List
                        </Link> */}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${
                                    errors.full_name ? 'border-red-500 focus:ring-red-500' : 'border-sidebar-border/70 dark:border-sidebar-border'
                                }`}
                                placeholder="Enter full name"
                                required
                            />
                            {errors.full_name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.full_name}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={data.phone}
                                onChange={(e) => {
                                    // Only allow numbers
                                    const value = e.target.value.replace(/\D/g, '');
                                    setData('phone', value);
                                }}
                                onKeyPress={(e) => {
                                    // Prevent non-numeric characters from being typed
                                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab') {
                                        e.preventDefault();
                                    }
                                }}
                                className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${
                                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-sidebar-border/70 dark:border-sidebar-border'
                                }`}
                                placeholder="Enter phone number"
                                required
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 ${
                                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-sidebar-border/70 dark:border-sidebar-border'
                                }`}
                                placeholder="Enter email address"
                                required
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <Link
                                href="/customers"
                                className="rounded-lg border border-sidebar-border/70 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-sidebar-border dark:text-gray-300 dark:hover:bg-gray-800/30"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Updating...' : 'Update Customer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
