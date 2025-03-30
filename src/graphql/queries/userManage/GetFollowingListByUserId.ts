import { gql } from '@apollo/client';

export const GET_FOLLOWING_LIST_BY_USER_ID = gql`
  query GetFollowingListByUserId($userId: String!, $lastCreatedAt: String) {
    getFollowingListByUserId(userId: $userId, lastCreatedAt: $lastCreatedAt) {
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
