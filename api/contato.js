const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Só aceitamos requisições POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido' });
    }

    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    try {
        // Conexão segura com o UOL Host usando variáveis de ambiente ocultas
        const transporter = nodemailer.createTransport({
            host: "smtp.uhserver.com",
            port: 587,
            secure: false, // true para porta 465, false para outras portas
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Configuração do e-mail que vai chegar na sua caixa
        const mailOptions = {
            from: '"Portal PASM" <no-reply@pasm.com.br>', // Quem envia (seu no-reply)
            to: "contato@pasm.com.br", // Quem recebe (sua caixa de atendimento)
            replyTo: email, // Se você clicar em "Responder", vai para o e-mail do lead
            subject: `🚀 Novo Lead B2B: ${nome}`,
            text: `Novo pedido de consultoria recebido pelo site.\n\n👤 Nome/Empresa: ${nome}\n📧 E-mail: ${email}\n\n📝 Desafio Técnico:\n${mensagem}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #2563eb; margin-bottom: 20px;">🚀 Novo Lead B2B</h2>
                    <p><strong>👤 Empresa/Gestor:</strong> ${nome}</p>
                    <p><strong>📧 Contato:</strong> ${email}</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                    <h3 style="color: #0f172a; margin-bottom: 10px;">Desafio Técnico:</h3>
                    <p style="background: #f8fafc; padding: 15px; border-radius: 8px; color: #475569;">${mensagem}</p>
                </div>
            `
        };

        // Dispara o e-mail
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });

    } catch (error) {
        console.error("Erro no envio do email: ", error);
        return res.status(500).json({ success: false, message: 'Erro interno ao enviar e-mail.' });
    }
}