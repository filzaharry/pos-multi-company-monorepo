import React from 'react';
import { ShieldCheck, Calendar } from 'lucide-react';

interface SubscriptionFilterProps {
    status: string;
    setStatus: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
}

export const SubscriptionFilter: React.FC<SubscriptionFilterProps> = ({
    status,
    setStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
}) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-black text-primary uppercase tracking-widest">Status</label>
                <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                    >
                        <option value="" className="bg-background-dark">All Status</option>
                        <option value="0" className="bg-background-dark">Pending</option>
                        <option value="1" className="bg-background-dark">Active</option>
                        <option value="2" className="bg-background-dark">Failed</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">Start Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-primary uppercase tracking-widest">End Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
