const Eris = require("eris");
const bot = new Eris(process.env.token);

let messageID = null;

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.username}`);

  const countMessages = async () => {
    const channel = bot.getChannel("1190634763971727500");

    if (!channel) {
      console.log('Canalul nu a fost găsit!');
      return;
    }

    try {
      let totalMessages = 0;
      let lastMessageID = null;

      do {
        const messages = await channel.getMessages({ limit: 900, before: lastMessageID });
        totalMessages += messages.length;

        if (messages.length > 0) {
          lastMessageID = messages[messages.length - 1].id;
        } else {
          break;
        }
      } while (totalMessages < 50);

      const embed = {
        color: 0x0099ff,
        description: `We currently have **${totalMessages}** vouches.`
      };

      if (messageID) {
        bot.deleteMessage(channel.id, messageID);
      }

      const sentMessage = await bot.createMessage(channel.id, { embed: embed });
      messageID = sentMessage.id;

      console.log(`Numărul total de mesaje în canalul ${channel.name} este: ${totalMessages}`);
    } catch (error) {
      console.error('A apărut o eroare:', error);
    }
  };

  setInterval(countMessages, 10 * 60 * 1000);
});

bot.connect();
