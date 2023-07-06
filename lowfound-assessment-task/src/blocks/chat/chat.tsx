import { Queueu } from './queue';
import './chat.css';

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

function makeItems(queue: Queueu) {
  return queue.getArray()?.map((item) => (
    <li className="chat_history__item response-item" key={item.id}>
      <div className="response-item__date">{getDateInCorrectFormat(item.date)}</div>
      <div className="response-item__question">
        <p className="response-item_blue">You asked</p>
        {item.question}
      </div>
      <div className="response-item__answer">
        <p className="response-item_blue">GPT responded:</p>
        {item.answer}
      </div>
      <div className="response-item__delete">Delete</div>
    </li>
  ));
}

export function Chat() {
  const queue = getQueue();
  return (
    <>
      <div className="chat">
        <ul className="chat_history">{makeItems(queue)}</ul>
        <form className="chat__send-question chat-input">
          <textarea
            name=""
            id=""
            className="chat-input__text"
            placeholder="Type your message here..."></textarea>
          <button type="submit" className="chat-input__button" onClick={() => {}} disabled>
            Send
          </button>
        </form>
      </div>
    </>
  );
}
