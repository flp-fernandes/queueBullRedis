const Mail = require('../lib/Mail');

module.exports = {
    key: 'RegistrationMail', 
    async handle({ data }) {
        const { user: { name, email } } = data;
        
        await Mail.sendMail({
            from: 'Queue Test <queue@queuetest.com>',
            to: `${name} <${email}`,
            subject: 'Cadastro de usuário',
            html: `Olá, ${name}! <br> Eu sei o que tu fizeste no verão passado! (risada maligna)`
        })
    }
}