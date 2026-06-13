'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SalesChartData } from '@/lib/modules/dashboard/services/dashboard.service';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface SalesChartProps {
    data?: SalesChartData[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ data: chartData }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b', // slate-800
                titleColor: '#fff',
                bodyColor: '#22c55e', // primary green
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: 'rgba(0,0,0,0.4)', // updated for light mode
                },
            },
            y: {
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: 'rgba(0,0,0,0.4)',
                },
            },
        },
    };

    const defaultLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const defaultData = [0, 0, 0, 0, 0, 0, 0];

    let labels = defaultLabels;
    let values = defaultData;

    if (chartData && chartData.length > 0) {
        labels = chartData.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        values = chartData.map(d => d.amount);
    }

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Sales',
                data: values,
                borderColor: '#22c55e', // primary
                backgroundColor: 'rgba(34, 197, 94, 0.1)', // primary/10
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#22c55e',
            },
        ],
    };

    return <Line options={options} data={data} />;
};
