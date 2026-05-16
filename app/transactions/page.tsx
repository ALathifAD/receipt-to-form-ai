'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Trash2, Receipt, TrendingUp } from 'lucide-react';

interface Transaction {
  id: string;
  merchantName: string;
  date: string;
  totalAmount: string;
  currency: string;
  savedAt: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortField, setSortField] = useState<keyof Transaction>('savedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('receipts') || '[]');
    setTransactions(stored);
  }, []);

  const handleDelete = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('receipts', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm('Delete all transactions?')) {
      setTransactions([]);
      localStorage.removeItem('receipts');
    }
  };

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = [...transactions].sort((a, b) => {
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  // Stats
  const total = transactions.reduce((sum, t) => sum + (parseFloat(t.totalAmount) || 0), 0);
  const currencies = [...new Set(transactions.map((t) => t.currency).filter(Boolean))];

  const SortIcon = ({ field }: { field: keyof Transaction }) => (
    <span className="ml-1 text-zinc-400 inline-block w-3">
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <main className="flex flex-1 w-full max-w-5xl mx-auto flex-col py-12 px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="bg-black dark:bg-white p-1.5 rounded-lg">
                <FileText className="w-4 h-4 text-white dark:text-black" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">All Transactions</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="h-9 px-4 flex items-center gap-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium transition-transform active:scale-95"
            >
              <Receipt className="w-3.5 h-3.5" /> New Receipt
            </button>
            {transactions.length > 0 && (
              <button
                onClick={handleClearAll}
                className="h-9 px-4 flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 text-sm font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">Total Receipts</p>
              <p className="text-3xl font-bold">{transactions.length}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">Total Spent</p>
              <p className="text-3xl font-bold">
                {currencies.length === 1 ? currencies[0] + ' ' : ''}{total.toFixed(2)}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">Avg per Receipt</p>
              <p className="text-3xl font-bold">
                {currencies.length === 1 ? currencies[0] + ' ' : ''}{(total / transactions.length).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-24 text-center">
            <div className="bg-zinc-100 dark:bg-zinc-900 p-5 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-zinc-400" />
            </div>
            <h2 className="text-lg font-semibold mb-1">No transactions yet</h2>
            <p className="text-zinc-500 text-sm mb-6">Scan a receipt to get started</p>
            <button
              onClick={() => router.push('/')}
              className="h-10 px-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium"
            >
              Scan First Receipt
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th
                      className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors select-none"
                      onClick={() => handleSort('merchantName')}
                    >
                      Merchant <SortIcon field="merchantName" />
                    </th>
                    <th
                      className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors select-none"
                      onClick={() => handleSort('date')}
                    >
                      Date <SortIcon field="date" />
                    </th>
                    <th
                      className="text-right px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors select-none"
                      onClick={() => handleSort('totalAmount')}
                    >
                      Amount <SortIcon field="totalAmount" />
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Currency
                    </th>
                    <th
                      className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors select-none"
                      onClick={() => handleSort('savedAt')}
                    >
                      Saved <SortIcon field="savedAt" />
                    </th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((t, i) => (
                    <tr
                      key={t.id}
                      className={`border-b border-zinc-50 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors ${
                        i % 2 === 0 ? '' : 'bg-zinc-50/50 dark:bg-zinc-800/20'
                      }`}
                    >
                      <td className="px-6 py-4 font-medium">
                        {t.merchantName || <span className="text-zinc-400 italic">Unknown</span>}
                      </td>
                      <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 tabular-nums">
                        {t.date || <span className="text-zinc-400 italic">—</span>}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-semibold tabular-nums">
                        {t.totalAmount
                          ? parseFloat(t.totalAmount).toFixed(2)
                          : <span className="text-zinc-400 font-normal italic">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        {t.currency ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {t.currency}
                          </span>
                        ) : (
                          <span className="text-zinc-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs tabular-nums">
                        {new Date(t.savedAt).toLocaleString('en-MY', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <p className="text-xs text-zinc-400">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} stored locally</p>
              <p className="text-xs text-zinc-400">Click column headers to sort</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
