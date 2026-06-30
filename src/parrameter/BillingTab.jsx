import React from 'react';
import { Check, CreditCard } from 'lucide-react';

export default function BillingTab() {
  const billingHistory = [
    { date: 'May 16, 2025', amount: '$9.99', status: 'Paid' },
    { date: 'May 16, 2025', amount: '$9.99', status: 'Paid' },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      features: ['5 Quizzes', 'Basic Analytics', '50 Student Limit'],
      disabled: ['Custom Branding', 'Advanced Question Types'],
      current: false,
      action: 'Current Plan',
      actionStyle: 'bg-[#1B1026] text-zinc-400 cursor-default'
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/mo',
      features: ['Unlimited Quizzes', 'Advanced Analytics', '500 Student Limit', 'Custom Branding', 'Advanced Question Types'],
      disabled: [],
      current: true,
      popular: true,
      action: 'Upgrade',
      actionStyle: 'bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] hover:opacity-95 shadow-lg shadow-[#FF7AB6]/20'
    },
    {
      name: 'Enterprise',
      price: '$12.99',
      period: '/mo',
      features: ['Everything in Pro', 'Unlimited Access', 'API Access', 'Dedicated Support', 'Custom Integrations'],
      disabled: [],
      current: false,
      action: 'Contact Sales',
      actionStyle: 'bg-[#1B1026] text-white hover:bg-[#2D1B3D] border border-zinc-700 hover:border-zinc-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Subscription Plan + Billing History */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white">Subscription Plan</h2>
        <p className="text-zinc-400 text-xs">Manage your subscription and billing details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <div className="bg-[#1B1026] border border-[#FF7AB6]/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Pro Plan</h3>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#FF7AB6]/15 text-[#FF7AB6] border border-[#FF7AB6]/20">
              Active
            </span>
          </div>
          <p className="text-zinc-400 text-xs">Your subscription renews on June 15, 2025</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Price</span>
              <span className="text-white font-semibold">$9.99 / month</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Billing Cycle</span>
              <span className="text-white font-medium">Monthly</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Payment Method</span>
              <span className="text-white font-medium flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                •••• •••• •••• 4242
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="px-4 py-2 rounded-xl border border-zinc-700 text-white text-xs font-semibold hover:border-zinc-500 transition-all">
              Change Plan
            </button>
            <button className="px-4 py-2 rounded-xl border border-zinc-700 text-white text-xs font-semibold hover:border-zinc-500 transition-all">
              Update Payment
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-[#1B1026] border border-[#FF7AB6]/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Billing History</h3>

          <div className="space-y-3">
            <div className="grid grid-cols-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-800">
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            {billingHistory.map((item, i) => (
              <div key={i} className="grid grid-cols-3 text-sm py-2">
                <span className="text-zinc-300">{item.date}</span>
                <span className="text-white font-medium">{item.amount}</span>
                <span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    {item.status}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <button className="px-4 py-2 rounded-xl border border-zinc-700 text-white text-xs font-semibold hover:border-zinc-500 transition-all">
            View All Invoices
          </button>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="space-y-1 pt-4">
        <h2 className="text-lg font-bold text-white">Plan Comparison</h2>
        <p className="text-zinc-400 text-xs">Compare available subscription plans</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-[#1B1026] border rounded-2xl p-6 space-y-5 ${
              plan.popular
                ? 'border-[#FF7AB6]/30 shadow-xl shadow-[#FF7AB6]/5'
                : 'border-[#FF7AB6]/10'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#FF7AB6] to-[#FFB86B] text-[#1B1026] text-[10px] font-bold uppercase tracking-wider rounded-full">
                Popular
              </div>
            )}

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-zinc-300">{feature}</span>
                </div>
              ))}
              {plan.disabled.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5 opacity-40">
                  <div className="w-4 h-4 rounded-full border border-zinc-600 shrink-0" />
                  <span className="text-xs text-zinc-500 line-through">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${plan.actionStyle}`}
            >
              {plan.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}