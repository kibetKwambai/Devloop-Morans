import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import { VerificationMarketplacePackage } from '../types';
import { Icon } from './Icon';

interface VerificationMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationMarketplaceModal: React.FC<VerificationMarketplaceModalProps> = ({
  isOpen,
  onClose
}) => {
  const { marketplacePackages, creditsBalance, purchaseVerificationPackage } = useAppContext();
  const [selectedPkg, setSelectedPkg] = useState<VerificationMarketplacePackage | null>(marketplacePackages[1] || null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('0722 000 000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    setIsProcessing(true);
    setTimeout(() => {
      purchaseVerificationPackage(selectedPkg.id, paymentMethod, `MPESA-TX-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsProcessing(false);
      setOrderComplete(true);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-t-3xl border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Verification Marketplace
              </span>
              <span className="text-xs text-emerald-200 font-mono">Wallet: {creditsBalance} Audit Credits</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Order Forensic Trust & Credential Verification</h2>
            <p className="text-xs text-emerald-200/80 mt-1 max-w-xl">
              Commission independent primary-source audits, direct statutory registrar queries, and accredited field inspections.
            </p>
          </div>

          <button onClick={onClose} className="text-emerald-200 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20">
            <Icon name="xMark" className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {orderComplete ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Icon name="check" className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Verification Order Confirmed</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Payment received via {paymentMethod.toUpperCase()}. 5 audit credits have been added to your balance, and an accredited field agent has been assigned to your case queue.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    const invoiceBlob = new Blob([`VERIFIEDHIRE TAX INVOICE\nReceipt: VH-INV-2024-918\nPackage: ${selectedPkg?.title}\nTotal Paid: KES ${selectedPkg?.priceKES.toLocaleString()}\nStatus: PAID`], { type: 'text/plain' });
                    const url = URL.createObjectURL(invoiceBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'verifiedhire-vat-receipt.txt';
                    a.click();
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Download VAT Tax Receipt
                </button>
                <button
                  onClick={() => { setOrderComplete(false); onClose(); }}
                  className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Packages Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {marketplacePackages.map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                      selectedPkg?.id === pkg.id 
                        ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    {pkg.isPopular && (
                      <span className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{pkg.targetAudience}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">{pkg.title}</h4>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                          KES {pkg.priceKES.toLocaleString()}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500 block">
                        Turnaround: {pkg.turnaroundDays} Business Days
                      </span>

                      <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                        {pkg.coverageItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Icon name="check" className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <div className={`w-full py-2 rounded-xl text-center text-xs font-bold ${
                        selectedPkg?.id === pkg.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {selectedPkg?.id === pkg.id ? 'Selected' : 'Select Package'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Checkout Panel */}
              {selectedPkg && (
                <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Secure Checkout: {selectedPkg.title}</h4>
                      <p className="text-xs text-slate-500">Includes 5 Verification Audit Credits & Verified Seal Guarantee.</p>
                    </div>
                    <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      KES {selectedPkg.priceKES.toLocaleString()}
                    </span>
                  </div>

                  <form onSubmit={handlePay} className="space-y-4 text-xs">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                        <input 
                          type="radio" 
                          name="method" 
                          checked={paymentMethod === 'mpesa'} 
                          onChange={() => setPaymentMethod('mpesa')}
                          className="text-emerald-600"
                        />
                        <span>M-PESA Express (STK Push)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                        <input 
                          type="radio" 
                          name="method" 
                          checked={paymentMethod === 'card'} 
                          onChange={() => setPaymentMethod('card')}
                          className="text-emerald-600"
                        />
                        <span>Credit / Debit Card (Visa, Mastercard)</span>
                      </label>
                    </div>

                    {paymentMethod === 'mpesa' ? (
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">M-PESA Mobile Number</label>
                        <input 
                          type="text" 
                          value={phoneNumber} 
                          onChange={(e) => setPhoneNumber(e.target.value)} 
                          className="w-full max-w-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 max-w-md gap-3">
                        <input type="text" placeholder="Card Number" className="p-2.5 rounded-xl border col-span-2 text-xs" />
                        <input type="text" placeholder="MM/YY" className="p-2.5 rounded-xl border text-xs" />
                        <input type="text" placeholder="CVC" className="p-2.5 rounded-xl border text-xs" />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? 'Prompting Phone via STK Push...' : `Pay KES ${selectedPkg.priceKES.toLocaleString()} & Activate Credits`}
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
