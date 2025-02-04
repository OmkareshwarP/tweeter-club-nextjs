import { gql } from '@apollo/client';

export const GET_USER_INFO = gql`
  query GetUserInfo {
    getUserInfo {
      error
      message
      statusCode
      errorCodeForClient
      data {
        userId
        username
        name
        profilePictureMediaId
        bio
        location
        website
        dob
        createdAt
      }
    }
  }
`;
