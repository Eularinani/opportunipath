import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = 'OportuniPath <newsletter@opportunipath.ao>';

const PRIMARY_COLOR = '#0D9488';
const TEXT_COLOR = '#0F172A';
const SUBTEXT_COLOR = '#64748B';
const BG_COLOR = '#F8FAFC';

export async function sendNewsletterWelcome(email: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Bem-vindo à OportuniPath! 🎓',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: ${TEXT_COLOR};">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; font-weight: 800; margin: 0;">
            Oportuni<span style="color: ${PRIMARY_COLOR};">Path</span>
          </h1>
        </div>
        <h2 style="font-size: 22px; color: ${TEXT_COLOR};">Bem-vindo(a) à nossa newsletter! 🎉</h2>
        <p style="color: ${SUBTEXT_COLOR}; line-height: 1.7;">
          A partir de agora vais receber semanalmente as melhores bolsas de estudo
          internacionais selecionadas para angolanos.
        </p>
        <div style="background: ${BG_COLOR}; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="font-weight: 600; margin: 0 0 8px;">O que vais receber:</p>
          <ul style="color: ${SUBTEXT_COLOR}; margin: 0; padding-left: 20px;">
            <li>Novas bolsas adicionadas</li>
            <li>Alertas de prazos a aproximar</li>
            <li>Dicas exclusivas de candidatura</li>
          </ul>
        </div>
        <a href="https://opportunipath.ao/bolsas"
           style="display: inline-block; background: ${PRIMARY_COLOR}; color: white; padding: 14px 28px;
                  border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Ver Bolsas Disponíveis →
        </a>
        <p style="color: ${SUBTEXT_COLOR}; font-size: 12px; margin-top: 32px;">
          Podes cancelar a subscrição a qualquer momento
          <a href="https://opportunipath.ao/unsubscribe?email=${encodeURIComponent(email)}" style="color: ${PRIMARY_COLOR};">aqui</a>.
        </p>
      </div>
    `,
  });
}

export async function sendContactConfirmation(nome: string, email: string, assunto: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Recebemos a tua mensagem — ${assunto}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: ${TEXT_COLOR};">
        <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 24px;">
          Oportuni<span style="color: ${PRIMARY_COLOR};">Path</span>
        </h1>
        <h2 style="font-size: 20px;">Olá ${nome}!</h2>
        <p style="color: ${SUBTEXT_COLOR}; line-height: 1.7;">
          Recebemos a tua mensagem sobre <strong>"${assunto}"</strong> e entraremos em
          contacto em breve (geralmente em 24-48h úteis).
        </p>
        <p style="color: ${SUBTEXT_COLOR};">Obrigado por contactares a OportuniPath! 🎓</p>
      </div>
    `,
  });
}

export async function notifyAdminNewContact(nome: string, email: string, assunto: string, mensagem: string) {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@opportunipath.ao';
  return resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `[OportuniPath] Novo contacto: ${assunto}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: ${TEXT_COLOR};">
        <h2>Novo contacto recebido</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${assunto}</p>
        <p><strong>Mensagem:</strong></p>
        <blockquote style="border-left: 4px solid ${PRIMARY_COLOR}; padding-left: 16px; color: ${SUBTEXT_COLOR};">
          ${mensagem}
        </blockquote>
      </div>
    `,
  });
}
