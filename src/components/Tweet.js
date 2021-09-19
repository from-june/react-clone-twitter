import React, { useState } from 'react';
import { dbService, storageService } from 'myFirebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

import 'css/Tweet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';

const Tweet = ({ tweetObj, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const OK = window.confirm('이 트윗을 삭제하시겠습니까?');
    if (OK) {
      await deleteDoc(doc(dbService, `tweets/${tweetObj.id}`));
    }
    if (OK && tweetObj.attachmentUrl) {
      await deleteObject(ref(storageService, tweetObj.attachmentUrl));
    }
  };

  const onToggleEditClick = () => setIsEditing(prev => !prev);
  const onNewTweetClick = event => {
    setNewTweet(event.target.value);
  };

  const onNewTweetSubmit = async event => {
    event.preventDefault();
    await updateDoc(doc(dbService, `tweets/${tweetObj.id}`), {
      text: newTweet
    });
    setIsEditing(false);
  };

  const getTweetDate = () => {
    const date = new Date(tweetObj.createdAt);
    return `${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className="Tweet">
      {isEditing ? (
        isOwner && (
          <form className="edit-form" onSubmit={onNewTweetSubmit}>
            <textarea
              className="edit-textarea"
              placeholder="내용을 수정하세요."
              required
              value={newTweet}
              onChange={onNewTweetClick}
            />
            <div className="btn-edit-box">
              <button className="btn-control btn-okay" type="submit">
                확인
              </button>
            </div>
          </form>
        )
      ) : (
        <div className="user-tweet">
          <div className="tweet-content">
            <img
              className="Tweet-userImg"
              src={tweetObj.creatorImg}
              alt="User"
            />
            <p className="Tweet-userName">{tweetObj.creatorName}</p>
            <span className="tweet-date">{getTweetDate()}</span>
          </div>
          <h4 className="tweet-text">{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <div className="selected-img-box">
              <img
                className="selected-img"
                src={tweetObj.attachmentUrl}
                alt="Selected file"
                width="150px"
                height="150px"
              />
            </div>
          )}
        </div>
      )}
      {isOwner && (
        <div className="btn-box">
          <button className="btn-edit" onClick={onToggleEditClick}>
            <FontAwesomeIcon icon={faEdit} size="1x" className="btn-icon" />
            <span className="visually-hidden">수정</span>
          </button>
          <button className="btn-delete" onClick={onDeleteClick}>
            <FontAwesomeIcon icon={faTrashAlt} size="1x" className="btn-icon" />
            <span className="visually-hidden">삭제</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Tweet;
