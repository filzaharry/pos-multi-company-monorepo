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

export const SalesChart = () => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#13191f',
                titleColor: '#fff',
                bodyColor: '#478cd1',
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
                    color: 'rgba(255,255,255,0.5)',
                },
            },
            y: {
                grid: {
                    color: 'rgba(255,255,255,0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: 'rgba(255,255,255,0.5)',
                },
            },
        },
    };

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                borderColor: '#478cd1',
                backgroundColor: 'rgba(71, 140, 209, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#478cd1',
            },
        ],
    };

    return <Line options={options} data={data} />;
};
