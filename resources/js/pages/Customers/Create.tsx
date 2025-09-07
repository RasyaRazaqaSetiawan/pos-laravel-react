import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        phone: '',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customers');
    };

    return (
        <AppLayout
            // breadcrumbs={[
            //     { title: 'Costumers', href: '/costumers' },
            //     { title: 'Create', href: '/costumers/create' },
            // ]}
        >
            <Head title="Create Customer" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-sidebar-accent">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Customer</h1>
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
                                placeholder="Enter phone number (numbers only)"
                                required
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email (optional) <span className="text-red-500">*</span>
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
                                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Creating...' : 'Create Customer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
