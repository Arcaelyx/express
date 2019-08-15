import amqp from 'amqplib/callback_api';

let conn, ch, uri;

const establishConnection = connString => {
  uri = connString;
  amqp.connect(uri, (err, connection) => {
    if (err) throw err;
    conn = connection;
  });
}

const createChannel = conn => {
  conn.createChannel((err, channel) => {
    if(err) throw err;

    channel.assertQueue(queue, {
      durable: false
    });

    ch = channel;
  });
};

const send = (msg, queue) => {
  if(!ch) createChannel(establishConnection(uri));
  ch.sendToQueue(queue, Buffer.from(msg));
}