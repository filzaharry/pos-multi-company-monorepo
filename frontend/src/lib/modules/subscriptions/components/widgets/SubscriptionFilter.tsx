import React from 'react';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { InputDropdown } from '@/components/ui/input';

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
            <InputDropdown
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="">All Status</option>
                <option value="0">Pending</option>
                <option value="1">Active</option>
                <option value="2">Failed</option>
            </InputDropdown>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800       block px-0.5">Start Date</label>
                    <CustomDatePicker
                        variant="light"
                        value={startDate}
                        onChange={(val) => setStartDate(val)}
                        placeholder="Select Start Date"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800       block px-0.5">End Date</label>
                    <CustomDatePicker
                        variant="light"
                        value={endDate}
                        onChange={(val) => setEndDate(val)}
                        placeholder="Select End Date"
                    />
                </div>
            </div>
        </div>
    );
};
