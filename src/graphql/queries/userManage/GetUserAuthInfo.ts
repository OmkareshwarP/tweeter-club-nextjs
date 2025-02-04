import { gql } from '@apollo/client';

export const GET_USER_AUTH_INFO = gql`
  query GetUserAuthInfo {
    getUserAuthInfo {
      error
      message
      statusCode
      errorCodeForClient
      data {
        userId
        email
        username
        name
        profilePictureMediaId
      }
    }
  }
`;
