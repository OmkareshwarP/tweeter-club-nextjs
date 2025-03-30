import { gql } from '@apollo/client';

export const FOLLOW_USER = gql`
  mutation FollowUser($followeeUserId: String!) {
    followUser(followeeUserId: $followeeUserId) {
      error
      message
      statusCode
      errorCodeForClient
      data
    }
  }
`;
