import { useState } from 'react';
import { Card, Button, Input, Textarea, Select, PageHeader } from '../components/ui/index.jsx';
import { FaRegSave } from "react-icons/fa";
import { MdBusinessCenter } from "react-icons/md";
import { TbFileInvoiceFilled } from "react-icons/tb";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { MdPreview } from "react-icons/md";

const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'CAD', 'AUD', 'JPY', 'INR'];
const TERMS      = ['Net 7', 'Net 14', 'Net 30', 'Net 60', 'Due on Receipt'];

export default function Settings({ store }) {
  const { settings, setSettings } = store;
  const [form,  setForm]  = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); setSaved(false); }

  function save() {
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="page-enter max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your business preferences" />

      <div className="space-y-6">
        {/* Business info */}
        <Card className="p-6 animate-fadeUp stagger-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-red-400 flex items-center justify-center text-sm"> <MdBusinessCenter /> </div>
            <p className="text-sm font-bold font-display text-slate-800">Business Information</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Business Name"  value={form.businessName}    onChange={e => setF('businessName',    e.target.value)} placeholder="My Business" />
            <Input label="Email"          value={form.businessEmail}   onChange={e => setF('businessEmail',   e.target.value)} placeholder="hello@mybusiness.com" type="email" />
            <Input label="Phone"          value={form.businessPhone}   onChange={e => setF('businessPhone',   e.target.value)} placeholder="+1 555-0000" />
            <Input label="Logo URL"       value={form.logoUrl}         onChange={e => setF('logoUrl',         e.target.value)} placeholder="https://..." />
            <div className="sm:col-span-2">
              <Textarea label="Address"   value={form.businessAddress} onChange={e => setF('businessAddress', e.target.value)} placeholder="123 Main St, City, State, Zip" rows={2} />
            </div>
          </div>
        </Card>

        {/* Invoice preferences */}
        <Card className="p-6 animate-fadeUp stagger-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-blue-300 flex items-center justify-center text-sm"> <TbFileInvoiceFilled />  </div>
            <p className="text-sm font-bold font-display text-slate-800">Invoice Preferences</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Currency" value={form.currency} onChange={e => setF('currency', e.target.value)}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </Select>
            <Select label="Default Payment Terms" value={form.paymentTerms} onChange={e => setF('paymentTerms', e.target.value)}>
              {TERMS.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Input label="Tax Label" value={form.taxLabel} onChange={e => setF('taxLabel', e.target.value)} placeholder="VAT / GST / Tax" />
            <Input label="Default Tax (%)" type="number" min="0" max="100" value={form.defaultTax} onChange={e => setF('defaultTax', e.target.value)} />
            <div className="sm:col-span-2">
              <Textarea label="Default Invoice Notes" value={form.invoiceNotes} onChange={e => setF('invoiceNotes', e.target.value)}
                placeholder="Thank you for your business! Payment due within 30 days." />
            </div>
          </div>
        </Card>

        {/* Brand color */}
        <Card className="p-6 animate-fadeUp stagger-3">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-blue-300 flex items-center justify-center text-sm"><MdOutlineBrandingWatermark /></div>
            <p className="text-sm font-bold font-display text-slate-800">Brand Color</p>
          </div>
          <div className="flex items-center gap-4">
            <input type="color" value={form.primaryColor} onChange={e => setF('primaryColor', e.target.value)}
              className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer p-1" />
            <div>
              <p className="text-sm font-semibold font-body text-slate-700">{form.primaryColor}</p>
              <p className="text-xs text-slate-400 font-body mt-0.5">Used on invoice accents</p>
            </div>
            <div className="ml-auto flex gap-2">
              {['#f59e0b','#6366f1','#10b981','#ef4444','#8b5cf6','#ec4899','#0ea5e9'].map(c => (
                <button key={c} onClick={() => setF('primaryColor', c)}
                  className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                  style={{ background: c, borderColor: form.primaryColor === c ? '#1e293b' : 'transparent' }} />
              ))}
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="p-6 animate-fadeUp stagger-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-sm"><MdPreview /></div>
            <p className="text-sm font-bold font-display text-slate-800">Business Preview</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-lg font-bold font-display" style={{ color: form.primaryColor }}>{form.businessName || 'My Business'}</p>
                <p className="text-xs text-slate-500 font-body">{form.businessEmail}</p>
                <p className="text-xs text-slate-500 font-body">{form.businessPhone}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-display text-slate-300">INVOICE</p>
                <p className="text-xs text-slate-400 font-body">INV-001</p>
              </div>
            </div>
            <div className="h-px bg-slate-200 mb-3" style={{ background: `linear-gradient(to right, ${form.primaryColor}, transparent)` }} />
            <p className="text-xs text-slate-400 font-body">{form.invoiceNotes}</p>
          </div>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-3 pb-4">
          <Button onClick={save} size="lg">
            {saved ? 'Saved!' : 'Save Settings'}
          </Button>
          {saved && <p className="text-sm text-emerald-600 font-semibold font-body animate-fadeIn">Changes saved successfully.</p>}
        </div>
      </div>
    </div>
  );
}