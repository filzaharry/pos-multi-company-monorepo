import jsPDF from 'jspdf';
import moment from 'moment';
import { CompanySubscription } from '../modules/subscriptions/types';

export const handleDownloadInvoice = (sub: CompanySubscription) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(34, 197, 94); // Primary green
    doc.text('INVOICE', 20, 30);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice #: INV-${String(sub.id).padStart(6, '0')}`, 20, 40);
    doc.text(`Date: ${moment(sub.created_at).format('DD MMMM YYYY')}`, 20, 45);

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 55, 190, 55);

    // Company Info
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Billed To:', 20, 70);

    doc.setFontSize(11);
    doc.text(sub.company_name || '-', 20, 80);
    doc.setTextColor(100, 100, 100);
    doc.text(`Contact: ${sub.full_name || '-'}`, 20, 86);
    doc.text(`Email: ${sub.business_email || '-'}`, 20, 92);

    // Subscription Details
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Subscription Details:', 110, 70);

    doc.setFontSize(11);
    doc.text(`Package: ${sub.package?.name || '-'}`, 110, 80);
    doc.setTextColor(100, 100, 100);
    doc.text(`Duration: ${sub.package?.duration_days || 30} days`, 110, 86);
    doc.text(`Period: ${sub.start_date ? moment(sub.start_date).format('DD MMM YYYY') : '-'} - ${sub.end_date ? moment(sub.end_date).format('DD MMM YYYY') : '-'}`, 110, 92);

    // Separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 105, 190, 105);

    // Payment Info
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('Payment Information', 20, 120);

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Method: ${sub.payment_method === 0 ? 'Bank Transfer' : 'QRIS / Digital'}`, 20, 130);
    doc.text(`Status: ${sub.payment_status === 1 ? 'PAID' : sub.payment_status === 2 ? 'FAILED' : 'PENDING'}`, 20, 136);

    // Total Amount
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text(`Total Amount: Rp ${sub.package?.pricing?.toLocaleString('id-ID') || '0'}`, 110, 130);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for your business!', 105, 270, { align: 'center' });

    doc.save(`invoice-${(sub.company_name || 'company').toLowerCase().replace(/\s+/g, '-')}-${moment(sub.created_at).format('YYYYMMDD')}.pdf`);
};
