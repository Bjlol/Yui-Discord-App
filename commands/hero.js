const utils = require('./../utils.js'), mentions = require('./../mention.js'),
    commands = require('./../commands.js');

module.exports = {
    name: "hero",
    execute: (msg, memberN, Discord, GuildsRPData, Heroes ,help) => {
        if (help) {
            let embed = new Discord.RichEmbed().setTitle(`Witaj ${memberN}`).addField('Użycie komendy:', '`yui!hero <gałąź> <argumenty / help>`')
                .addField('Opis', 'W zależności od gałęzi pomagam zarządzać twoim bohaterem')
                .addField('Gałęzie:', `\`create\` - Tworzy nowego bohatera
                                       \`list\` - Pokazuję listę bohaterów i ich id (potrzebne do innych komend)
                                       \`info\` - Pokazuję info o bohaterze
                                       \`field\` - Zarządza polami informacji bohatera
                                       \`delete\` - Usuń postać
                                       \`status\` - Pokazuje status postaci (Zaakctepowana, Odrzucona, Do sprawdzenia)
                                       \`check\` - Przekazuje postać do sprawdzenia dla administracji
                                       \`pass\` - Oddaje komuś twoją postać`)
            if (msg.member.hasPermission('MANAGE_ROLES') || utils.isOwner(msg.author.id)) {
                embed.addField('Gałęzie admina:', 
                `**fields**:
                >> \`list\` - Pokazuje listę pól i ich id (potrzebne do innych podkomend)
                >> \`add\` - Dodaje pole o określonej nazwie
                >> \`delete\` - Usuwa pole o określonej cyfrze
                >> **optional**:
                |➜ \`list\` - Pokazuje listę pól i ich id (potrzebne do innych podkomend)
                |➜ \`add\` - Dodaje pole o określonej nazwie
                |➜ \`delete\` - Usuwa pole o określonej cyfrze`)
                embed.addField('event:', `
                >> \`aprove\`: Co mam zrobić kiedy ktoś zaakceptuje postać?
                |➜ \`message\`:
                |>> ➜ \`show\` - Pokazuje spersonalizowaną wiadomość
                |>> ➜ \`set\` - Ustawia / usuwa spersonalizowaną wiadomość
                |➜ \`role\`: 
                |>> ➜ \`add\` - Jaką role dać po akceptacji?
                |>> ➜ \`delete\` - Jaką role zabrać po akceptacji?
                **role**:- Jaka rola ma mieć uprawnienia do sprawdzania postaci?
                |➜ \`show\` - Pokazuje jaka rola do zarządzania postaciami
                |➜ \`set\` - Ustawia role do zarządzania postaciami
                **hero**:
                |➜ \`approve\` - Akctepuj bohatera
                |➜ \`decline\` - Odrzuć bohatera
                |➜ **max**:
                |>> ➜ \`show\` - Pokazuje maksymalną liczbe postaci na serwerze
                |>> ➜ \`set\` - Ustawia maksymalną liczbe postaci`)
            }
            msg.channel.send(embed)
        } else {
            
        }
    }
}