import { Queueu, Value } from './queue';
import './chat.css';
import { useState, useEffect, SyntheticEvent, useRef } from 'react';
import { apiEndPoint } from '../../api';
import React from 'react';

function getDateInCorrectFormat(date: Date) {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

function makeItems(
  queueArray: Value[] | null,
  setQueueArray: React.Dispatch<React.SetStateAction<Value[] | null>>
) {
  queueArray?.sort((a, b) => b.createDate.getTime() - a.createDate.getTime());
  return !queueArray || queueArray.length === 0 ? (
    <>
      <div className="chat_history__item_top">
        Your chat is empty. Send your first message to start a chat.
      </div>
    </>
  ) : (
    queueArray.map((item, index) => (
      <li className="chat_history__item response-item" key={item.id}>
        <div className="response-item__date">{getDateInCorrectFormat(item.createDate)}</div>
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
          onClick={async () => {
            setQueueArray(queueArray.slice(0, index).concat(queueArray.slice(index + 1)));
            await fetch(`${apiEndPoint}/messages/${queueArray[index].id}`, {
              method: 'DELETE',
              credentials: 'include'
            });
          }}>
          Delete
        </div>
      </li>
    ))
  );
}

export function Chat() {
  const queue = useRef(new Queueu());
  const [queueArray, setQueueArray] = useState(new Queueu().getArray());
  const [message, setMessage] = useState('');
  const handleMessageChange = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement;
    setMessage(target.value);
  };
  const fetchUserMessages = () => {
    let varQueue = new Queueu();
    fetch(`${apiEndPoint}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((response) => {
        return response.json();
      })
      .then((userMessages) => {
        for (let i = 0; i < userMessages.length; i += 1) {
          varQueue.enqueue({
            id: userMessages[i].id,
            question: userMessages[i].question,
            answer: userMessages[i].answer,
            createDate: new Date(userMessages[i].createDate)
          });
        }
        queue.current = JSON.parse(JSON.stringify(varQueue));
        setQueueArray(varQueue.getArray());
      });
  };
  useEffect(() => {
    fetchUserMessages();
  }, []);

  async function sendMessage() {
    setMessage('Message is sent, wait for it to generate');
    const response = await fetch(`${apiEndPoint}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      credentials: 'include',
      body: message
    });
    const messageBody = await response.json();
    setMessage('');
    messageBody.createDate = new Date(messageBody.createDate);
    if (!queueArray) return;
    const newArray = queueArray;
    newArray.push(messageBody);
    setQueueArray(newArray);
    setMessage('');
  }
  return (
    <>
      <div className="chat">
        <ul className="chat_history">{makeItems(queueArray, setQueueArray)}</ul>
        <form className="chat__send-question chat-input">
          <textarea
            name=""
            id=""
            className="chat-input__text"
            placeholder="Type your message here..."
            value={message}
            onChange={handleMessageChange}></textarea>
          <a
            className={`chat-input__button${
              message && message !== 'Message is sent, wait for it to generate'
                ? ' chat-input__button__enabled'
                : ''
            }`}
            onClick={async () => await sendMessage()}>
            Send
          </a>
        </form>
      </div>
    </>
  );
}
