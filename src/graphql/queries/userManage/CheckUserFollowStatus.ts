import { gql } from '@apollo/client';

export const CHECK_USER_FOLLOW_STATUS = gql`
  query CheckUserFollowStatus($followeeUserId: String!) {
    checkUserFollowStatus(followeeUserId: $followeeUserId) {
      error
      message
      statusCode
      errorCodeForClient
      data {
        isFollowed
      }
    }
  }
`;
