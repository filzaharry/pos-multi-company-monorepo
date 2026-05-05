import React from 'react';
import { Column } from "@/components/ui/DataTable";
import { Edit3, Trash2 } from "lucide-react";
import { LandingFaq, LandingPackage, LandingTestimonial } from "../types";

export const getPackageColumns = (
    onEdit: (item: LandingPackage) => void,
    onDelete: (item: LandingPackage) => void
): Column<LandingPackage>[] => [
        { header: 'Package Name', accessorKey: 'name', sortable: true },
        {
            header: 'Price',
            accessorKey: 'pricing',
            sortable: true,
            cell: (item) => (
                <span className="font-bold text-white">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.pricing)}
                </span>
            )
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item) => (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                    {item.status || 'Active'}
                </span>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            cell: (item) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

export const getTestimonialColumns = (
    onEdit: (item: LandingTestimonial) => void,
    onDelete: (item: LandingTestimonial) => void
): Column<LandingTestimonial>[] => [
        { header: 'Author', accessorKey: 'name', sortable: true },
        {
            header: 'Rating',
            accessorKey: 'rating',
            sortable: true,
            cell: (item) => (
                <div className="flex items-center gap-1">
                    <span className="text-yellow-500 font-bold">{item.rating}</span>
                    <span className="text-yellow-500/50">★</span>
                </div>
            )
        },
        { header: 'Content', accessorKey: 'content', className: 'max-w-md truncate' },
        {
            header: 'Actions',
            align: 'right',
            cell: (item) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="p-2 bg-red-500/5 hover:bg-red-500/20 rounded-lg transition-all text-red-500"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

export const getFaqColumns = (
    onEdit: (item: LandingFaq) => void,
    onDelete: (item: LandingFaq) => void
): Column<LandingFaq>[] => [
        { header: 'Question', accessorKey: 'title', sortable: true },
        { header: 'Answer', accessorKey: 'subtitle', className: 'max-w-md truncate' },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (item) => (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                    {item.status || 'Active'}
                </span>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            cell: (item) => (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(item)}
                        className="p-2 bg-red-500/5 hover:bg-red-500/20 rounded-lg transition-all text-red-500"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];
