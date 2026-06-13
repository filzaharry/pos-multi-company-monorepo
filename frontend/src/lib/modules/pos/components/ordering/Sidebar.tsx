import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Minus, Plus, Save, Loader2, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InputText, InputDropdown } from '@/components/ui/input';
import { PosDelivery } from '../../types';
import { OrderItem } from './types';

interface SidebarProps {
    orderItems: OrderItem[];
    customerName: string;
    setCustomerName: (name: string) => void;
    phoneNumber: string;
    setPhoneNumber: (phone: string) => void;
    deliveryId: number;
    setDeliveryId: (id: number) => void;
    paymentMethod: number;
    setPaymentMethod: (id: number) => void;
    deliveries: PosDelivery[];
    totalAmount: number;
    isSubmitting: boolean;
    onSubmit: () => void;
    removeItem: (index: number) => void;
    updateItemQuantity: (index: number, qty: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    orderItems,
    customerName,
    setCustomerName,
    phoneNumber,
    setPhoneNumber,
    deliveryId,
    setDeliveryId,
    paymentMethod,
    setPaymentMethod,
    deliveries,
    totalAmount,
    isSubmitting,
    onSubmit,
    removeItem,
    updateItemQuantity
}) => {
    return (
        <div className="w-full lg:w-[28rem] xl:w-[32rem] shrink-0 flex flex-col">
            <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden sticky top-6 max-h-[calc(100vh-8rem)]">
                {/* Header Summary */}
                <div className="p-6 md:p-8 border-b border-slate-100">
                    <h4 className="text-[10px] font-bold text-primary   tracking-[0.3em] mb-6 flex items-center gap-3">
                        <div className="w-1 h-3 bg-primary rounded-full" />
                        Cart Summary
                    </h4>

                    <div className="grid grid-cols-1 gap-4">
                        <InputText
                            label="Customer Name"
                            icon={User}
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Enter your name"
                            className="text-xs"
                        />
                        <InputText
                            label="Table / Phone"
                            icon={Phone}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Table number or phone"
                            className="text-xs"
                        />
                    </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-4">
                    {orderItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-800 opacity-40">
                            <ShoppingBag className="w-16 h-16 mb-4" />
                            <p className="text-[10px]  font-bold">Cart Empty</p>
                        </div>
                    ) : (
                        orderItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4 relative group hover:border-slate-200 transition-colors"
                            >
                                <Button
                                    theme="light"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeItem(index)}
                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>

                                <div className="flex justify-between items-start pr-10">
                                    <div>
                                        <p className="text-xs font-bold text-slate-800      ">{item.name}</p>
                                        <p className="text-[10px] text-primary font-bold mt-1">Rp {item.unit_price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white rounded-2xl px-2 py-1 border border-slate-200 shadow-sm">
                                        <Button theme="light" variant="ghost" size="icon" onClick={() => updateItemQuantity(index, Math.max(1, item.quantity - 1))} className="w-6 h-6 p-0 rounded-xl text-slate-800 hover:text-slate-900 transition-colors">
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                                        <Button theme="light" variant="ghost" size="icon" onClick={() => updateItemQuantity(index, item.quantity + 1)} className="w-6 h-6 p-0 rounded-xl text-slate-800 hover:text-slate-900 transition-colors">
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Show selected levels and extras as badges or text to save space since editing is done via Bottom Sheet now */}
                                {(item.level_ids.length > 0 || item.extra_ids.length > 0) && (
                                    <div className="pt-2 border-t border-slate-200">
                                        {item.level_ids.map(id => {
                                            const lvl = item.available_levels.find(l => l.value === id);
                                            return lvl ? <p key={id} className="text-[10px] text-slate-500">• Level: {lvl.label}</p> : null;
                                        })}
                                        {item.extra_ids.map(id => {
                                            const ext = item.available_extras.find(e => e.value === id);
                                            return ext ? <p key={id} className="text-[10px] text-slate-500">• Extra: {ext.label}</p> : null;
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Footer Summary */}
                <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <InputDropdown
                            label="Delivery/Table"
                            value={deliveryId.toString()}
                            onChange={(e) => setDeliveryId(Number(e.target.value))}
                            className="h-12 text-[10px] font-bold"
                        >
                            <option value="0" className="bg-white text-slate-800">Dine In / Takeaway</option>
                            {deliveries.map(del => (
                                <option key={del.id} value={del.id} className="bg-white text-slate-800">{del.name}</option>
                            ))}
                        </InputDropdown>
                        <InputDropdown
                            label="Payment"
                            value={paymentMethod.toString()}
                            onChange={(e) => setPaymentMethod(Number(e.target.value))}
                            className="h-12 text-[10px] font-bold"
                        >
                            <option value="0" className="bg-white text-slate-800">Cash / Counter</option>
                            <option value="1" className="bg-white text-slate-800">QRIS / Digital</option>
                        </InputDropdown>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                        <div>
                            <p className="text-[10px] font-bold text-slate-800   tracking-[0.2em] mb-1">Total Bill</p>
                            <h3 className="text-3xl font-bold text-slate-800 tracking-tighter">
                                <span className="text-primary text-sm mr-1.5  ">Rp</span>
                                {totalAmount.toLocaleString()}
                            </h3>
                        </div>
                        <Button
                            onClick={onSubmit}
                            disabled={isSubmitting || orderItems.length === 0 || !customerName.trim()}
                            theme="light"
                            size="lg"
                            icon={isSubmitting ? undefined : Save}
                            isLoading={isSubmitting}
                            className="rounded-[1.25rem]"
                        >
                            {isSubmitting ? '...' : 'Process Order'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
