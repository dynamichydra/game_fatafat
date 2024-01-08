
var DokuMe_Sender = function(connection) {
    var _ = this;
    _.conn = connection;
};

DokuMe_Sender.prototype.sendMessage = function(msg){
    var _ = this;
    
    var stringMessage = JSON.stringify(msg);
    _.conn.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = process.env.RABBITMQ_NOTIFICATIONS_QUEUE;

        channel.assertQueue(queue, {
          durable: true
        });

        channel.sendToQueue(queue, Buffer.from(stringMessage), { persistent: true });
    });
};

module.exports = DokuMe_Sender;
