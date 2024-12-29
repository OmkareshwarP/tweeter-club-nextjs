import { gql } from '@apollo/client';

export const GET_BASIC_USER_INFO = gql`
  query GetBasicUserInfo {
    getBasicUserInfo {
      error
      message
      statusCode
      errorCodeForClient
      data {
        userId
        email
        username
        firstname
        lastname
        profilePictureMediaId
      }
    }
  }
`;
