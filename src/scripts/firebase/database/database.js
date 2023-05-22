import { getDatabase, ref, update, get } from "firebase/database";
import { auth, database } from "../config/firebaseConfig";

/*
 * CREATE ERROR
 * function to create an error object
 */

const createError = (message, code) => ({
  message,
  code,
});

/*
 * GET USER PROFILE DETAILS
 * function to get user profile details from database
 */

const getUserProfileDetails = async (uid) => {
  // check whether the browser supports local storage api
  let localStorageAvailable = false;

  if (typeof Storage !== "undefined") {
    localStorageAvailable = true;

    // check whether the user profile details are cached in local storage
    const userProfileDetailsCache = localStorage.getItem(
      "userProfileDetailsCache"
    );

    // if cached data is available and the uid matches, return the cached data
    if (userProfileDetailsCache && JSON.parse(userProfileDetailsCache).data.uid === uid) {
      return JSON.parse(userProfileDetailsCache);
    }
  } else {
    // throw an error if local storage is not supported
    throw createError(
      "Local storage is not supported by your browser",
      "local-storage-not-supported"
    );
  }

  // if cached data is not available, fetch it from database
  const snapshot = await get(ref(database, `users/${uid}`));
  const {
    username,
    email,
    name,
    phoneNumber,
    bio,
    haveExperience,
    isLearning,
    yearOfAdmission,
    admissionNumber,
    degree,
    course,
    residentialStatus,
    location,
    linkedinProfile,
    discordProfile,
    githubProfile,
    twitterProfile, } = snapshot.val();
  const userProfileDetails = {
    uid,
    username,
    email,
    name,
    phoneNumber,
    bio,
    haveExperience,
    isLearning,
    yearOfAdmission,
    admissionNumber,
    degree,
    course,
    residentialStatus,
    location,
    linkedinProfile,
    discordProfile,
    githubProfile,
    twitterProfile,
  };

  // cache the data in local storage if possible
  if (localStorageAvailable) {
    localStorage.setItem(
      "userProfileDetailsCache",
      JSON.stringify({ data: userProfileDetails, isCached: true })
    );
  }
  return { data: userProfileDetails, isCached: false };
};

/*
 * UPDATE USER PROFILE DETAILS
 * function to update user profile details in database
 */

const updateUserProfileDetails = async (uid, data) => {

  console.log(JSON.stringify(JSON.parse(localStorage.getItem("userProfileDetailsCache")).data));
  // update the user profile details in database
  try{
  await update(ref(database, `users/${uid}`), data);

  // update the user profile details in local storage if possible
  if (typeof Storage !== "undefined") {
    const userProfileDetailsCache = localStorage.getItem(
      "userProfileDetailsCache"
    );
    if (userProfileDetailsCache) {
      localStorage.setItem(
        "userProfileDetailsCache",
        JSON.stringify({
          data: { ...JSON.parse(userProfileDetailsCache).data, ...data },
          isCached: true,
        })
      );
    }
  }}
  catch(error){
    throw createError(
      "Local storage is not supported by your browser",
      "local-storage-not-supported"
    );
  }
  return { data, isCached: false };
};

export { getUserProfileDetails, updateUserProfileDetails };
