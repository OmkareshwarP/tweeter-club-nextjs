import { gql } from '@apollo/client';

export const GET_USER_BASIC_INFO = gql`
  query GetUserBasicInfo {
    getUserBasicInfo {
      error
      message
      statusCode
      errorCodeForClient
      data {
        userId
        username
        name
        profilePictureMediaId
        followingCount
        followersCount
      }
    }
  }
`;
