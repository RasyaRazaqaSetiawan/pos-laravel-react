import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Receipt } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 text-[#1b1b18] dark:bg-neutral-800">
                {/* Main Card Container */}
                <main className="w-full max-w-md">
                    <div className="overflow-hidden rounded-2xl bg-white transition-all duration-300 dark:bg-gray-800">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-center">
                            {/* Icon POS */}
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <Receipt className="h-8 w-8 text-white" />
                            </div>

                            {/* Title dan subtitle */}
                            <h1 className="mb-2 text-2xl font-bold text-white">Welcome to POS</h1>
                            <p className="text-blue-100">Point of Sales Management System</p>
                        </div>

                        {/* Card Body */}
                        <div className="p-8">
                            {/* Action buttons section */}
                            <div className="space-y-4">
                                {/* Conditional rendering berdasarkan authentication status */}
                                {auth.user ? (
                                    // Jika user sudah login, tampilkan link ke dashboard
                                    <Link
                                        href={dashboard()}
                                        className="block w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-center font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-4 focus:ring-blue-500/30 focus:outline-none"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    // Jika user belum login, tampilkan Login dan Register links
                                    <>
                                        {/* Login Link */}
                                        <Link
                                            href={login()}
                                            className="block w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-center font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-4 focus:ring-blue-500/30 focus:outline-none"
                                        >
                                            Sign In
                                        </Link>

                                        {/* Register Link */}
                                        <Link
                                            href={register()}
                                            className="block w-full transform rounded-xl border-2 border-gray-200 bg-gray-50 px-6 py-4 text-center font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-100 hover:shadow-md focus:ring-4 focus:ring-gray-500/30 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                        >
                                            Create New Account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="border-t border-gray-200 bg-gray-50 px-8 py-6 dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                                Created By{' '}
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    <a href="https://github.com/RasyaRazaqaSetiawan">Rasya Razaqa Setiawan</a>
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Additional decorative elements */}
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center space-x-3">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400/40 dark:bg-blue-400/60"></div>
                            <div className="animation-delay-150 h-2 w-2 animate-pulse rounded-full bg-blue-500/60 dark:bg-blue-500/80"></div>
                            <div className="animation-delay-300 h-2 w-2 animate-pulse rounded-full bg-blue-600/80 dark:bg-blue-600"></div>
                        </div>
                        <p className="mt-4 text-xs text-gray-500/80 dark:text-gray-400/80">Secure • Reliable • Modern</p>
                    </div>
                </main>
            </div>
        </>
    );
}
