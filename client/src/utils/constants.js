

export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "api/auth";



export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;

export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;

export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const DELETE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/delete-profile-image`;


export const CONTACTS_ROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`;
export const GET_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-contacts`;
export const GET_ALL_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/get-all-contacts`;


export const MESSAGES_ROUTES = "api/messages"
export const GET_ALL_MESSAGES = `${MESSAGES_ROUTES}/get-messages`
export const UPLOADR_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file `

export const CHANNEL_ROUTES = "api/channel"
export const CREATE_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/create-channel`
export const GET_USER_CHANNELS_ROUTES = `${CHANNEL_ROUTES}/get-user-channels`
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channels-messages`


