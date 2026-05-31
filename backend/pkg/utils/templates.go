package utils

import (
	"fmt"
)

func GetSubscriptionEmailTemplate(fullName, companyName, packageName, phoneNumber, paymentMethodStr string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 40px 30px; }
        .content h2 { font-size: 20px; font-weight: 700; margin-top: 0; color: #0f172a; }
        .content p { font-size: 15px; color: #475569; margin-bottom: 24px; }
        .details-box { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #64748b; }
        .detail-value { font-weight: 700; color: #0f172a; text-align: right; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>POS SaaS Cloud</h1>
        </div>
        <div class="content">
            <h2>Pengajuan Berlangganan Diterima</h2>
            <p>Halo <strong>%s</strong>,</p>
            <p>Terima kasih telah mengajukan pendaftaran berlangganan layanan POS SaaS Cloud untuk bisnis Anda. Tim kami telah menerima rincian pembayaran Anda dan saat ini sedang melakukan proses verifikasi.</p>
            
            <div class="details-box">
                <div class="detail-row">
                    <span class="detail-label">Nama Perusahaan</span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Nama Pemilik</span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Paket Dipilih</span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Nomor Telepon</span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Metode Pembayaran</span>
                    <span class="detail-value">%s</span>
                </div>
                <div class="detail-row" style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 8px;">
                    <span class="detail-label" style="color: #0f172a;">Status Pengajuan</span>
                    <span class="detail-value" style="color: #d97706;">Menunggu Persetujuan Admin</span>
                </div>
            </div>

            <p><strong>Langkah Selanjutnya:</strong><br>
            Tim admin kami akan memverifikasi bukti pembayaran yang Anda unggah dalam kurun waktu maksimal 1x24 jam. Setelah disetujui, Anda akan menerima email konfirmasi aktivasi beserta detail akun masuk (login) untuk dashboard POS Anda.</p>
            
            <p>Mohon tunggu informasi terbaru selanjutnya dari kami.</p>
            <p>Salam hangat,<br><strong>Tim POS SaaS Cloud Support</strong></p>
        </div>
        <div class="footer">
            &copy; 2026 POS SaaS Cloud. Hak cipta dilindungi undang-undang.<br>
            Email ini dikirim secara otomatis, mohon tidak membalas email ini.
        </div>
    </div>
</body>
</html>`, fullName, companyName, fullName, packageName, phoneNumber, paymentMethodStr)
}

func GetForgotPasswordEmailTemplate(otpCode string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
        .wrapper { max-width: 500px; margin: 40px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 32px 24px; text-align: center; }
        .content h2 { font-size: 18px; font-weight: 700; margin-top: 0; color: #0f172a; }
        .content p { font-size: 14px; color: #475569; margin-bottom: 24px; }
        .otp-code { display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 0.15em; color: #16a34a; background: #f0fdf4; border: 1px dashed #bbf7d0; padding: 12px 30px; border-radius: 12px; margin: 10px 0; }
        .info-note { font-size: 12px; color: #94a3b8; margin-top: 24px; }
        .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>POS SaaS Cloud</h1>
        </div>
        <div class="content">
            <h2>Permintaan Reset Password</h2>
            <p>Kami menerima permintaan untuk mereset kata sandi akun Anda. Gunakan kode OTP di bawah ini untuk melanjutkan:</p>
            <div class="otp-code">%s</div>
            <p class="info-note">Kode ini hanya berlaku selama 15 menit. Jika Anda tidak merasa melakukan permintaan ini, harap abaikan email ini.</p>
        </div>
        <div class="footer">
            &copy; 2026 POS SaaS Cloud. Hak cipta dilindungi undang-undang.
        </div>
    </div>
</body>
</html>`, otpCode)
}

func GetLoginOTPEmailTemplate(otpCode string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
        .wrapper { max-width: 500px; margin: 40px auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); padding: 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 32px 24px; text-align: center; }
        .content h2 { font-size: 18px; font-weight: 700; margin-top: 0; color: #0f172a; }
        .content p { font-size: 14px; color: #475569; margin-bottom: 24px; }
        .otp-code { display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 0.15em; color: #16a34a; background: #f0fdf4; border: 1px dashed #bbf7d0; padding: 12px 30px; border-radius: 12px; margin: 10px 0; }
        .info-note { font-size: 12px; color: #94a3b8; margin-top: 24px; }
        .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>POS SaaS Cloud</h1>
        </div>
        <div class="content">
            <h2>Kode OTP Masuk (Login)</h2>
            <p>Gunakan kode OTP berikut untuk menyelesaikan proses verifikasi masuk ke akun POS Anda:</p>
            <div class="otp-code">%s</div>
            <p class="info-note">Kode ini hanya berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun demi keamanan akun Anda.</p>
        </div>
        <div class="footer">
            &copy; 2026 POS SaaS Cloud. Hak cipta dilindungi undang-undang.
        </div>
    </div>
</body>
</html>`, otpCode)
}
