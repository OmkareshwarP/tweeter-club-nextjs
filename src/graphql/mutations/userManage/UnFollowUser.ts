import { gql } from '@apollo/client';

export const UNFOLLOW_USER = gql`
  mutation UnFollowUser($followeeUserId: String!) {
    unFollowUser(followeeUserId: $followeeUserId) {
      error
      message
      statusCode
      errorCodeForClient
      data
    }
  }
`;
