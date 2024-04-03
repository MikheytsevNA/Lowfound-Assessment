import { Queueu, Value } from './queue';
import './chat.css';
import { useState, useEffect, SyntheticEvent, useRef } from 'react';
import { apiEndPoint } from '../../api';
import React from 'react';
import { TailSpin } from 'react-loader-spinner';

function getDateInCorrectFormat(date: Date) {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

async function resentMessage(
  queueArray: Value[] | null,
  index: number,
  setQueueArray: React.Dispatch<React.SetStateAction<Value[] | null>>
) {
  await fetch(`${apiEndPoint}/messages/${queueArray[index].id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  const response = await fetch(`${apiEndPoint}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    credentials: 'include',
    body: queueArray[index].question
  });

  const messageBody = await response.json();

  if (messageBody.error) {
    alert('Resent was unsuccessful');
    console.log(messageBody);
    return;
  }
  messageBody.createDate = new Date(messageBody.createDate);
  if (!queueArray) return;
  const newArray = queueArray;
  const idToDelete = newArray.splice(index, 1)[0];
  newArray.push(messageBody);
  setQueueArray(newArray);
  /* await fetch(`${apiEndPoint}/messages/${idToDelete.id}`, {
    method: 'DELETE',
    credentials: 'include'
  }); */
}

function makeItems(
  queueArray: Value[] | null,
  setQueueArray: React.Dispatch<React.SetStateAction<Value[] | null>>
) {
  const [loading, setLoading] = useState(false);
  queueArray?.sort((a, b) => b.createDate.getTime() - a.createDate.getTime());
  return !queueArray || queueArray.length === 0 ? (
    <>
      <div className="chat_history__item_top">
        Your chat is empty. Send your first message to start a chat.
      </div>
    </>
  ) : (
    queueArray.map((item, index) => {
      return (
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
          {item.error === true ? (
            <div
              className={`response-item__reload ${
                loading ? 'response-item__reload__disabled' : ''
              }`}
              onClick={async () => {
                setLoading(true);
                await resentMessage(queueArray, index, setQueueArray);
                setLoading(false);
              }}>
              {loading ? (
                <TailSpin color="red" radius={'2px'} height={'20px'} width={'20px'} />
              ) : (
                'Re-sent'
              )}
            </div>
          ) : (
            ''
          )}
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
      );
    })
  );
}

export function Chat() {
  const queue = useRef(new Queueu());
  const [queueArray, setQueueArray] = useState(new Queueu().getArray());
  //const queue = useRef(fillQueue());
  // const [queueArray, setQueueArray] = useState(fillQueue().getArray());
  const [message, setMessage] = useState('');
  const inputIsBusy = useRef(false);
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
            error: userMessages[i].error,
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
    inputIsBusy.current = true;
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
    inputIsBusy.current = false;
    messageBody.createDate = new Date(messageBody.createDate);
    if (!queueArray) return;
    const newArray = queueArray;
    newArray.push(messageBody);
    setQueueArray(newArray);
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
            onChange={handleMessageChange}
            disabled={inputIsBusy.current}></textarea>

          <a
            className={`chat-input__button${
              message !== '' && !inputIsBusy.current ? ' chat-input__button__enabled' : ''
            }`}
            onClick={async () => await sendMessage()}>
            Send
          </a>
        </form>
      </div>
    </>
  );
}
