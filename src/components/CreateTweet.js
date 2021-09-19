import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from 'myFirebase';
import { addDoc, collection } from '@firebase/firestore';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';

import 'css/CreateTweet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const CreateTweet = ({ signedInUser }) => {
  const [tweet, setTweet] = useState('');
  const [attachment, setAttachment] = useState('');

  const onInputChange = event => {
    setTweet(event.target.value);
  };

  const onTweetSubmit = async event => {
    event.preventDefault();

    let attachmentUrl = '';
    if (attachment !== '') {
      const attachmentRef = ref(
        storageService,
        `${signedInUser.uid}/${uuidv4()}`
      );
      const uploadImg = await uploadString(
        attachmentRef,
        attachment,
        'data_url'
      );
      attachmentUrl = await getDownloadURL(uploadImg.ref);
    }

    await addDoc(collection(dbService, 'tweets'), {
      text: tweet,
      createdAt: Date.now(),
      creatorId: signedInUser.uid,
      creatorImg: signedInUser.photoURL,
      creatorName: signedInUser.displayName,
      attachmentUrl
    });

    setTweet('');
    setAttachment('');
  };

  const onImgClearClick = () => {
    setAttachment(null);
  };

  const onFileChange = event => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = event => {
      setAttachment(event.target.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <>
      <form onSubmit={onTweetSubmit} className="tweet-form">
        <textarea
          className="tweet-area"
          onChange={onInputChange}
          value={tweet}
          placeholder="무슨 일이 있었나요?"
          maxLength={120}
          require="true"
        />

        <div className="tweet-file">
          <label
            className="input-img-label"
            htmlFor="tweet-img"
            aria-label="이미지 업로드"
          >
            <FontAwesomeIcon icon={faImage} size="3x" className="input-img" />
          </label>
          <input
            id="tweet-img"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>
        {attachment && (
          <div className="attachment-box">
            <img
              src={attachment}
              alt="Seleted file"
              className="attachment-img"
            />
            <button
              className="btn-control btn-cancel"
              type="button"
              onClick={onImgClearClick}
            >
              취소
            </button>
          </div>
        )}
        <button type="submit" className="btn-send">
          <span className="visually-hidden">발행</span>
          <FontAwesomeIcon icon={faPencilAlt} size="lg" className="submit" />
        </button>
      </form>
    </>
  );
};

export default CreateTweet;
