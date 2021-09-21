import React, { useState } from 'react';
import { authService, dbService, storageService } from 'myFirebase';
import { updateProfile } from '@firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import { getDownloadURL, ref, uploadString } from '@firebase/storage';

import 'css/EditProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';

const EditProfile = ({ signedInUser, refreshUser, bioText }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [newDisplayName, setNewDisplayName] = useState(
    signedInUser.displayName
  );
  const [userBio, setUserBio] = useState(bioText);

  const onImgChange = event => {
    const selectedImg = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = event => {
      setNewPhotoURL(event.target.result);
    };
    reader.readAsDataURL(selectedImg);
  };

  const onInputTextChange = event => {
    if (event.target.name === 'name') setNewDisplayName(event.target.value);
    if (event.target.name === 'bio') setUserBio(event.target.value);
  };

  const onFormSubmit = async event => {
    event.preventDefault();

    let attachmentUrl = '';
    if (newPhotoURL !== '') {
      const photoURLRef = ref(storageService, `${signedInUser.uid}`);
      const uploadImg = await uploadString(
        photoURLRef,
        newPhotoURL,
        'data_url'
      );
      attachmentUrl = await getDownloadURL(uploadImg.ref);
      await updateProfile(authService.currentUser, {
        photoURL: attachmentUrl
      });
      refreshUser();
      setIsEditing(false);
    }

    if (signedInUser.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName
      });
      refreshUser();
      setIsEditing(false);
    }

    if (isEditing) {
      await setDoc(doc(dbService, 'bio', signedInUser.uid), {
        text: userBio,
        creatorId: signedInUser.uid
      });
      setIsEditing(false);
    }
  };

  const onToggleEditClick = () => {
    setIsEditing(prev => !prev);
  };

  return (
    <>
      {isEditing && (
        <div className="EditProfile">
          <form
            className="edit-form edit-form__profile"
            onSubmit={onFormSubmit}
          >
            {newPhotoURL && (
              <div className="preview-box">
                <img
                  className="preview-userImg"
                  src={newPhotoURL}
                  alt="Selected file"
                  width="100px"
                  height="100px"
                />
              </div>
            )}

            <label
              className="input-img-label edit-userImg"
              htmlFor="Profile-userImg"
              aria-label="사용자 이미지 업로드"
            >
              <FontAwesomeIcon
                icon={faImage}
                size="3x"
                className="input-img edit-userImg-icon"
              />
            </label>
            <input
              id="Profile-userImg"
              type="file"
              accept="image/*"
              name="userImg"
              onChange={onImgChange}
            />

            <div className="edit-content">
              <div className="input-userName">
                <label className="label" htmlFor="Profile-userName">
                  이름
                </label>
                <input
                  id="Profile-userName"
                  type="text"
                  name="name"
                  placeholder="옐"
                  required
                  maxLength={8}
                  value={newDisplayName}
                  onChange={onInputTextChange}
                />
              </div>
              <div className="input-userBio">
                <label className="label" htmlFor="Profile-userBio">
                  자기소개
                </label>
                <input
                  placeholder="노마드코더 클론트위터 챌린지"
                  id="Profile-userBio"
                  type="text"
                  name="bio"
                  value={userBio}
                  onChange={onInputTextChange}
                  maxLength={30}
                />
              </div>
            </div>
            <div className="profile-btn-box">
              <button className="btn-control btn-okay btn-save" type="submit">
                저장
              </button>
              <button
                className="btn-control btn-cancel"
                onClick={onToggleEditClick}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}
      {!isEditing && (
        <button
          className="btn-control btn-edit-profile"
          onClick={onToggleEditClick}
        >
          프로필수정
        </button>
      )}
    </>
  );
};

export default EditProfile;
