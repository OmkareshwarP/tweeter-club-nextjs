import { gql } from '@apollo/client';

export const GET_BASIC_USER_INFO_BY_USERNAME = gql`
  query GetBasicUserInfoByUsername($username: String!) {
    getBasicUserInfoByUsername(username: $username) {
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
