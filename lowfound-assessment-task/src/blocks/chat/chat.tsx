import { Queueu } from './queue';
import './chat.css';
import { getChat } from './openAiTests';
import { useState } from 'react';

function getQueue(): Queueu {
  const queue = new Queueu();
  queue.enqueue({
    id: self.crypto.randomUUID(),
    question: '123',
    answer: '213',
    date: new Date(Date.now())
  });
  queue.enqueue({
    id: self.crypto.randomUUID(),
    question: '3333',
    answer: '123',
    date: new Date(Date.now() + 2000)
  });
  queue.enqueue({
    id: self.crypto.randomUUID(),
    question: '3443',
    answer: '1121',
    date: new Date(Date.now() + 3400)
  });
  return queue;
}

function getDateInCorrectFormat(date: Date) {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDay()} ${
    months[date.getMonth()]
  } ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

function makeItems(Varqueue: Queueu | null) {
  const [queue, setQueue] = useState(!Varqueue ? getQueue() : Varqueue);
  const [queueArray, setQueueArray] = useState(queue.getArray());
  if (!queueArray)
    return (
      <>
        <div>Your chat is empty. Send your first message to start a chat.</div>
      </>
    );
  return queueArray.map((item, index) => (
    <li className="chat_history__item response-item" key={item.id}>
      <div className="response-item__date">{getDateInCorrectFormat(item.date)}</div>
      <div className="response-item__question">
        <p className="response-item_blue">You asked:</p>
        {item.question}
      </div>
      <div className="response-item__answer">
        <p className="response-item_blue">GPT responded:</p>
        {item.answer}
      </div>
      <div
        className="response-item__delete"
        onClick={() => {
          queue.delete(index);
          setQueue(queue);
          setQueueArray(queue.getArray());
        }}>
        Delete
      </div>
    </li>
  ));
}

export function Chat() {
  return (
    <>
      <div className="chat">
        <ul className="chat_history">{makeItems(null)}</ul>
        <form className="chat__send-question chat-input">
          <textarea
            name=""
            id=""
            className="chat-input__text"
            placeholder="Type your message here..."></textarea>
          <button
            type="button"
            className="chat-input__button"
            onClick={() => getChat(['Hello World!'])}
            disabled>
            Send
          </button>
        </form>
      </div>
    </>
  );
}
