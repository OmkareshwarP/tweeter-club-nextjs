import { gql } from '@apollo/client';

export const GET_FOLLOWERS_LIST_BY_USER_ID = gql`
  query GetFollowersListByUserId($userId: String!, $lastCreatedAt: String) {
    getFollowersListByUserId(userId: $userId, lastCreatedAt: $lastCreatedAt) {
      error
      message
      statusCode
      errorCodeForClient
      data {
        userId
        username
        name
        profilePictureMediaId
        createdAt
      }
    }
  }
`;
